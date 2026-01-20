import { Request, Response } from "express";
import { UserDatabase } from "../../models/user.model";
import { generateSecret, generateURI } from "otplib";

export const twoFactorAuthSetupController = async (
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

    const exisitingUser = await UserDatabase.findById(authUser.id);

    if (!exisitingUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found ! ",
      });
    }

    const secret = generateSecret();

    const uri = generateURI({
      issuer: "MyService",
      label: exisitingUser.email,
      secret,
    });
    
    exisitingUser.twoFactorSecret = secret;
    await exisitingUser.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: "two factor authentication setup completed successfully",
      uri,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error",
    });
  }
};
