import { Request, Response } from "express";
import { userRestpsswordSchema } from "./auth.schema";
import crypto from "crypto";
import { UserDatabase } from "../../models/user.model";
import { hashPassword, verifyPassword } from "../../utils/passwordHelpers";

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const parsedBody = userRestpsswordSchema.safeParse(req.body);

    // if body data doesn't pass type check
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "reset password token not found",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "password not found !",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const existingUser = await UserDatabase.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "invalid or expired token !",
      });
    }

    const isSamePassword = await verifyPassword(
      password,
      existingUser.passwordHash
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "New password cannot be the same as the previous password",
      });
    }

    const newPassword = await hashPassword(password);

    existingUser.passwordHash = newPassword;
    existingUser.resetPasswordToken = null;
    existingUser.resetPasswordTokenExpiry = null;
    existingUser.TokenVersion=existingUser.TokenVersion+1,
    existingUser.save();

    return res.status(200).json({
      success: false,
      error: true,
      message: "password reset successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error",
    });
  }
};
