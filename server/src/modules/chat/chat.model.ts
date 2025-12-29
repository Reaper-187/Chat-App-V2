import mongoose, { Schema, Document } from "mongoose";

// Chat kennt nur die Teilnehmer !!!

interface ChatType extends Document {
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<ChatType>(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  {
    timestamps: true, // erstellt automatisch createdAt und updatedAt
  }
);

module.exports = mongoose.model<ChatType>("Chat", chatSchema);
