import mongoose, { Schema, Document, Model } from "mongoose";

// Chat kennt nur die Teilnehmer !!!

interface ChatType extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<ChatType>(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: String,
  },
  {
    timestamps: true, // erstellt automatisch createdAt und updatedAt
  }
);

const Chat: Model<ChatType> = mongoose.model<ChatType>("Chat", chatSchema);
export { Chat };
