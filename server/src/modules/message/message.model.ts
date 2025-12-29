import mongoose, { Schema, Document } from "mongoose";

interface MessageProps extends Document {
  chatId: string;
  senderId: mongoose.Types.ObjectId;
  content: string;
  messageType: string;
  timeStamp: Date;
}

const messageSchema = new Schema<MessageProps>({
  chatId: String,
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: String,
  messageType: {
    type: String,
    enum: ["text", "imange", "file"],
    default: "text",
  },
  timeStamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model<MessageProps>("Message", messageSchema);
