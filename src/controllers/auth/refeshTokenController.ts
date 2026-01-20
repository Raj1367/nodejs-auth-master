import { Request, Response } from "express";
import {
  JwtSignupHelper,
  JwtVerifyHelper,
} from "../../utils/jsonWebTokenHelper";
import { UserDatabase } from "../../models/user.model";

interface RefreshTokenPayload {
  userId: string;
  role: "GENERAL" | "ADMIN";
  tokenVersion: Number;
}

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshtoken as string | undefined;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Refresh token not found",
      });
    }

    const decoded = JwtVerifyHelper(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as RefreshTokenPayload;

    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid refresh token",
      });
    }

    const existingUser = await UserDatabase.findById(decoded.userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found !",
      });
    }

    const accessPayload = {
      userId: existingUser._id,
      role: existingUser.role,
      tokenVersion: existingUser.TokenVersion,
    };

    if (existingUser.TokenVersion !== accessPayload.tokenVersion) {
      return res.status(401).json({ success: false,
        error: true,message: "Refresh token invalidated" });
    }

    const newAccessToken = JwtSignupHelper(
      accessPayload,
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "30m" }
    );
    const newRefreshToken = JwtSignupHelper(
      { userId: existingUser._id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "1d" }
    );

    res.cookie("refreshtoken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      error: false,
      message: "New access token generated",
      data: {
        accessToken: newAccessToken,
        user: {
          id: existingUser._id,
          username: existingUser.userName,
          email: existingUser.email,
          role: existingUser.role,
          isEmailVerified: existingUser.isEmailVerified,
          twoFactorEnabled: existingUser.twoFactorAuthEnabled,
        },
      },
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: true,
      message: error.message || "Invalid or expired refresh token",
    });
  }
};
