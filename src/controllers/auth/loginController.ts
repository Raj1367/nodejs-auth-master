import { Request, Response } from "express";
import { userLoginSchema } from "./auth.schema.js";
import { UserDatabase } from "../../models/user.model.js";
import { verifyPassword } from "../../utils/passwordHelpers.js";
import { JwtSignupHelper } from "../../utils/jsonWebTokenHelper.js";

const validateEnv = () => {
  switch (true) {
    case !process.env.JWT_ACCESS_SECRET:
      throw new Error("JWT_ACCESS_SECRET Not Found !");

    case !process.env.JWT_REFRESH_SECRET:
      throw new Error("JWT_REFRESH_SECRET Not Found !");

    default:
      return true;
  }
};

export const LoginController = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const parsedBody = userLoginSchema.safeParse(req.body);

    // if body data doesn't pass type check
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    // extract from parsed body
    const { email, password, twoFactorCode } = parsedBody.data;

    //  email to lowecase
    const normalizedEmail = email.toLowerCase().trim();

    //  check if user exits by email
    const existingUser = await UserDatabase.findOne({
      email: normalizedEmail,
    });

    //  if user doesn't exits in database
    if (!existingUser) {
      return res.status(409).json({
        success: false,
        error: true,
        message: "User doesn't exist in database",
      });
    }

    //  verify password
    const verifiedPassword = await verifyPassword(
      password,
      existingUser.passwordHash as string
    );

    // if password is not verified
    if (!verifiedPassword) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "passowrds don't match",
      });
    }

    if (!existingUser.isEmailVerified) {
      return res.status(409).json({
        success: false,
        error: true,
        message: "please verify your email before login!",
      });
    }

    // 2 FACTOR AUTH
    if (existingUser.twoFactorAuthEnabled) {
      if (!twoFactorCode || typeof twoFactorCode !== "string") {
        return res.status(400).json({
          success: false,
          error: true,
          message: "2 factor code is required ! ",
        });
      }
       if (!existingUser.twoFactorSecret) {
        return res.status(400).json({
          success: false,
          error: true,
          message: "2 factor miss configured ! ",
        });
      }

      //  verify code 
      

    }

    //  JWT payload
    const payload = {
      userId: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
      tokenVersion: existingUser.TokenVersion,
    };

    //  check if env variables exists
    validateEnv();

    // access token
    const accessToken = JwtSignupHelper(
      payload,
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "30m" }
    );

    // refresh token
    const refreshToken = JwtSignupHelper(
      payload,
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "1d" }
    );

    // save refresh token in cookies
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    console.log(`refreshtoken:${refreshToken}`);

    //  if all works return success
    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      data: {
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
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error",
    });
  }
};
