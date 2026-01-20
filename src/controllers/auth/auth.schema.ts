import z from "zod";

export const userSignupSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  userName: z.string().trim().min(3).max(25),
  userGender: z.enum(["MALE", "FEMALE"]).default("MALE"),
  userContact: z.string(),
  email: z.string().email(),
  password: z.string().min(6).max(25),
  role: z.enum(["GENERAL", "ADMIN"]).default("GENERAL"),
  isEmailVerifed: z.boolean().default(false),
  twoFactorAuthEnabled: z.boolean().default(false),
});

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(3).max(25),
  accessToken: z.string().default(""),
  twoFactorCode: z.string().optional(),
});

export const userRestpsswordSchema = z.object({
  password: z.string().min(3).max(25),
});
