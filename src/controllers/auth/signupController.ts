import { Request, Response } from "express";
import { UserDatabase } from "../../models/user.model.js";
import SendEmail from "../../utils/nodeMailer.js";
import { emailVerificationTemplate } from "../../email/emailVerificationTemplate.js";
import { JwtSignupHelper } from "../../utils/jsonWebTokenHelper.js";
import { userSignupSchema } from "./auth.schema.js";
import { hashPassword } from "../../utils/passwordHelpers.js";

export const SignupController = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    // frontend body data
    const parsedBody = userSignupSchema.safeParse(req.body);

    // if body data doesn't pass type check
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    // extract
    const { email, password } = parsedBody.data;

    //  email to lowecase
    const normalizedEmail = email.toLowerCase().trim();

    //  check if user exits by email
    const existingUser = await UserDatabase.findOne({
      email: normalizedEmail,
    });

    //  if user doesn't exits in database
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: true,
        message: "User already exists",
      });
    }

    //  hash password
    const hashedPassword = await hashPassword(password);

    // create user ifd passes all checks
    const createUser = await UserDatabase.create({
      ...parsedBody.data,
      email: normalizedEmail,
      passwordHash: hashedPassword,
    });

    // check if JWT_EMAIL_SECRET  exits
    if (!process.env.JWT_EMAIL_SECRET) {
      throw new Error("JWT_EMAIL_SECRET Not Found !");
    }

    //  payload for JWT
    const payload = {
      userId: createUser._id,
      email: createUser.email,
      username: createUser.userName,

    };

    // generate email verification token
    const emailVerificationToken = JwtSignupHelper(
      payload,
      process.env.JWT_EMAIL_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    // verify user email url
    const verifyUrl = `${process.env.APP_URL}/api/auth/verify-email?token=${emailVerificationToken}`;

    //  data for email html template
    const html = emailVerificationTemplate({
      userName: createUser.userName,
      verificationLink: verifyUrl,
      expiryTime: "24 hours",
      appName: "MyApp",
    });

    //  send  email verification mail
    await SendEmail(createUser.email, "verify your email", html);

    // return response without showing password
    const userDataWithoutPassword = await UserDatabase.findById(
      createUser._id
    ).select("-passwordHash");

    //all works create user and return success
    return res.status(201).json({
      success: true,
      error: false,
      message: "USer created successfully",
      data: userDataWithoutPassword,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error || "Internal server error",
    });
  }
};
