import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserDatabase } from "../../models/user.model.js";
import { JwtVerifyHelper } from "../../utils/jsonWebTokenHelper.js";

interface EmailTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export const VerifyEmailController = async (req: Request, res: Response) => {
  try {
    //extract token
    const token = req.query.token as string | undefined;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "verification token missing",
      });
    }

    if (!process.env.JWT_EMAIL_SECRET) {
      throw new Error("JWT_EMAIL_SECRET not found!");
    }

    //extract verify token
    const payload = JwtVerifyHelper(
      token,
      process.env.JWT_EMAIL_SECRET
    ) as EmailTokenPayload;

    // if verify find it and update
    const verifiedUser = await UserDatabase.findOneAndUpdate(
      {
        _id: payload.userId,
        isEmailVerified: false,
      },
      {
        $set: { isEmailVerified: true },
      },
      { new: true }
    );

    // if user is not verified
    if (!verifiedUser) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "User not found or already verified",
      });
    }
    //  if all works usre is verified successfully
    return res.status(200).json({
      success: true,
      error: false,
      message: "User email verified successfully",
      data: verifiedUser,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal server error",
    });
  }
};


