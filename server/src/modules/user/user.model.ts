import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole } from "../../types/express";

interface UserType extends Document {
  userRole: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  createdOn: Date;
  blockedAccount: {
    wrongPwCounter: number;
    blocked: boolean;
  };
  verification: {
    veryfiStatus: boolean;
    veryficationToken: string;
    verifyTokenExp: Date;
  };
  otp: {
    otpNum: number;
    otpExp: Date;
  };
  resetToken: { token: number; tokenExp: Date };
}

const verificationSchema = new Schema({
  veryfiStatus: { type: Boolean, default: false },
  veryficationToken: { type: String },
  verifyTokenExp: { type: Date },
});

const blockedAccountSchema = {
  wrongPwCounter: { type: Number, default: 0 },
  blocked: { type: Boolean, default: false },
};

const otpSchema = new Schema({
  otpNum: { type: Number },
  otpExp: { type: Date },
});

const resetTokenSchema = new Schema({
  token: { type: Number },
  tokenExp: { type: Date },
});

const userSchema = new Schema<UserType>({
  userRole: { type: String, default: "user" },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  avatar: { type: String },
  createdOn: { type: Date, default: Date.now },
  blockedAccount: blockedAccountSchema,
  verification: verificationSchema,
  otp: otpSchema,
  resetToken: resetTokenSchema,
});

const User: Model<UserType> = mongoose.model<UserType>("User", userSchema);
export { User };
