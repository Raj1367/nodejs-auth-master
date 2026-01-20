import { Request, Response } from "express";
import { getGoogleClient } from "../../utils/googleClient";

export const googleAuthController = async (
  req: Request,
  res: Response
) => {
  try {
    const client = getGoogleClient();

    const url = client.generateAuthUrl({
      access_type: "offline", // needed for refresh token
      prompt: "consent",      // forces refresh token every time
      scope: ["openid", "email", "profile"],
    });
    return res.redirect(url);
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate Google authentication",
    });
  }
};
