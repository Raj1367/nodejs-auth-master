import { Request, Response } from "express";
import { UserDatabase } from "../../models/user.model";
import crypto from "crypto";
import SendEmail from "../../utils/nodeMailer";
import { resetPasswordTemplate } from "../../email/resetPasswordTemplate";

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Request body is missing",
      });
    }

    const { email } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await UserDatabase.findOne({ email: normalizedEmail });

    if (!existingUser) {
      return res.status(400).json({
        message:
          "If user with this email exists, you will receive a reset link.",
      });
    }

    // create a token -> random string fo 32 chars and hash it
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    existingUser.resetPasswordToken = tokenHash;
    existingUser.resetPasswordTokenExpiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await existingUser.save();

    const resetPasswordUrl = `${process.env.APP_URL}/api/auth/reset-password?token=${rawToken}`;

    //  data for email html template
    const html = resetPasswordTemplate({
      userName: existingUser.userName,
      resetPasswordLink: resetPasswordUrl,
      expiryTime: "5 mins",
      appName: "MyApp",
    });

    //  send  reset password link
    await SendEmail(existingUser.email, "reset password link", html);

    return res.status(200).json({
      success: false,
      error: true,
      message: "reset link sent successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error",
    });
  }
};
