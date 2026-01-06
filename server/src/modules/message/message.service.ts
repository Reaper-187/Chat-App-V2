import mongoose from "mongoose";
import { User } from "../user/user.model";
import { Guest } from "../guest/guest.model";
import { Chat } from "../chat/chat.model";
import { Message } from "./message.model";

interface SendMessagesFuncProps {
  senderId: string;
  recipientUserId: string;
  content: string;
}
export async function saveSendMessage({
  senderId,
  recipientUserId,
  content,
}: SendMessagesFuncProps): Promise<{
  chatId: string;
  message: SendMessagesFuncProps;
}> {
  const findReceivedUser =
    (await User.findById(recipientUserId)) ||
    (await Guest.findById(recipientUserId));

  if (!senderId || !findReceivedUser) {
    throw new Error("No sender or recipient found");
  }

  let chat = await Chat.findOne({
    participants: {
      $all: [senderId, recipientUserId].map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    },
  });

  if (!chat) {
    chat = await Chat.create({
      participants: [senderId, recipientUserId].map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    });
  }

  const newMessageDoc = new Message({
    chatId: chat._id,
    senderId,
    recipientUserId,
    content,
  });

  await newMessageDoc.save();

  const newMessage: SendMessagesFuncProps = {
    senderId,
    recipientUserId,
    content,
  };

  return { chatId: chat._id.toString(), message: newMessage };
}
