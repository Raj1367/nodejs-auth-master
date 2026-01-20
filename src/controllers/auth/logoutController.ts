import { Request, Response } from "express";

export const logoutController = async (req: Request, res: Response) => {
  try {
    const refershToken = req.cookies?.refreshtoken as string | undefined;

    if (!refershToken) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "refresh token not found or user already logout.",
      });
    }

    res.clearCookie("refreshtoken");

    return res.status(200).json({
      success: true,
      error: false,
      message: "Logout successful",
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: true,
      message: error.message || "Invalid or expired refresh token",
    });
  }
};
