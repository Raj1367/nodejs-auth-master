import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: undefined,
    },

    lastName: {
      type: String,
      trim: true,
      default: undefined,
    },

    userName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    userGender: {
      type: String || undefined,
      enum: ["MALE", "FEMALE"],
      default: undefined,
    },

    userContact: {
      type: String,
      default: undefined,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    authProvider: {
      type: String,
      enum: ["LOCAL", "GOOGLE"],
      required: true,
      default: "LOCAL",
    },

    passwordHash: {
      type: String,
      required: function () {
        return this.authProvider === "LOCAL";
      },
    },

    role: {
      type: String,
      enum: ["GENERAL", "ADMIN"],
      default: "GENERAL",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    twoFactorAuthEnabled: {
      type: Boolean,
      default: false,
    },

    twoFactorSecret: {
      type: String,
      default: undefined,
    },

    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordTokenExpiry: {
      type: Date,
      default: undefined,
    },
    TokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const UserDatabase = model("User", userSchema);
