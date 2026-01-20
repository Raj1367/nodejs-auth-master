import { NextFunction, Request, Response } from "express";
import { JwtVerifyHelper } from "../utils/jsonWebTokenHelper";
import { UserDatabase } from "../models/user.model";

interface AccessTokenPayload {
  userId: string;
  role: "GENERAL" | "ADMIN";
  tokenVersion: Number;
}

export const isUserAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          message: "Bearer token not found you are not Authenticated !",
        });
    }

    const token = authHeader.split(" ")[1] as string;
    const payload = JwtVerifyHelper(token,process.env.JWT_ACCESS_SECRET!) as AccessTokenPayload;

    const existingUser = await UserDatabase.findById(payload.userId);

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User not found !",
      });
    }

    if (existingUser.TokenVersion !== payload.tokenVersion) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invaild token !",
      });
    }

    const authRequest = req as any;

    authRequest.user = {
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
      userName: existingUser.userName,
      isEmailVerified: existingUser.isEmailVerified,
    };
    
    next();
    
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error",
    });
  }
};
