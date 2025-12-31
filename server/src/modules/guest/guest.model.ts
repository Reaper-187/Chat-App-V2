import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole } from "../../types/express";

interface GuestType extends Document {
  userRole: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  createdOn: Date;
  expiresAt: Date;
}

const guestSchema = new Schema<GuestType>({
  userRole: { type: String, default: "guest" },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  createdOn: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const Guest: Model<GuestType> = mongoose.model<GuestType>("Guest", guestSchema);
export { Guest };
