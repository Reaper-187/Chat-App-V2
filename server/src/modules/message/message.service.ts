import mongoose from "mongoose";
import { User } from "../user/user.model";
import { Guest } from "../guest/guest.model";
import { Chat } from "../chat/chat.model";
import { Message } from "./message.model";

interface SendMessagesFuncProps {
  senderId: string;
  recipientId: string;
  content: string;
}
export async function saveSendMessage({
  senderId,
  recipientId,
  content,
}: SendMessagesFuncProps): Promise<{
  chatId: string;
  message: SendMessagesFuncProps;
}> {
  const findReceivedUser =
    (await User.findById(recipientId)) || (await Guest.findById(recipientId));

  if (!senderId || !findReceivedUser) {
    throw new Error("No sender or recipient found");
  }

  let chat = await Chat.findOne({
    participants: {
      $all: [senderId, recipientId].map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [senderId, recipientId].map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    });
  }

  const newMessageDoc = new Message({
    chatId: chat._id,
    senderId,
    recipientId,
    content,
  });

  await newMessageDoc.save();

  const newMessage: SendMessagesFuncProps = {
    senderId,
    recipientId,
    content,
  };

  return { chatId: chat._id.toString(), message: newMessage };
}
