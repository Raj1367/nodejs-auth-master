import { Request, Response } from "express";
import { getGoogleClient } from "../../utils/googleClient";
import { UserDatabase } from "../../models/user.model";
import { generateUsername } from "../../utils/randomUsername";
import { JwtSignupHelper } from "../../utils/jsonWebTokenHelper";

const googleAuthCallbackController = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string | undefined;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is missing",
      });
    }

    const client = getGoogleClient();

    // 1️⃣ Exchange code for token
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({
        success: false,
        message: "Google ID token not received",
      });
    }

    // 2️⃣ Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    if (!payload.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified",
      });
    }

    const normalizedEmail = payload.email.toLowerCase().trim();

    // 3️⃣ Check if user already exists
    let user = await UserDatabase.findOne({ email: normalizedEmail });

    // 4️⃣ Create user if not exists
    if (!user) {
      user = await UserDatabase.create({
        firstName: payload.given_name || "",
        lastName: payload.family_name || "",
        userName: generateUsername(),
        email: normalizedEmail,
        role: "GENERAL",
        authProvider: "GOOGLE",
        isEmailVerified: true,
        twoFactorAuthEnabled: false,
      });
    }

    // 5️⃣ Generate JWT tokens
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      username: user.userName,
    };

    const accessToken = JwtSignupHelper(
      tokenPayload,
      process.env.JWT_ACCESS_SECRET!
    );

    const refreshToken = JwtSignupHelper(
      tokenPayload,
      process.env.JWT_REFRESH_SECRET!
    );

     res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
      },
    });


  } catch (error) {
    console.error("Google Auth Callback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

export default googleAuthCallbackController;
