import { Request, Response } from "express";
import { UserDatabase } from "../../models/user.model";
import { verify } from "otplib";

export const verifyTwoFactorController = async (
  req: Request,
  res: Response
) => {
  try {
    const authRequest = req as any;
    const authUser = authRequest.user;

    if (!authUser) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not authenticated ! ",
      });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "2FA code reqiured ! ",
      });
    }

    const existingUser = await UserDatabase.findById(authUser.id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found ! ",
      });
    }

    if (!existingUser.twoFactorSecret) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "2FA setup not comepleted ! ",
      });
    }
    const isValid = verify({
      token: code,
      secret: existingUser.twoFactorSecret,
    });

    if (!isValid) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "2FA verification failed invalid code! ",
      });
    }

    existingUser.twoFactorAuthEnabled = true;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: "two factor authentication completed successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error",
    });
  }
};
