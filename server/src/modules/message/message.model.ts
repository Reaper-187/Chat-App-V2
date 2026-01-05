import mongoose, { Schema, Document, Model } from "mongoose";

interface MessageProps extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  timeStamp: Date;
}

const messageSchema = new Schema<MessageProps>({
  chatId: String,
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: String,
  timeStamp: { type: Date, default: Date.now },
});

const Message: Model<MessageProps> = mongoose.model<MessageProps>(
  "Message",
  messageSchema
);
export { Message };
