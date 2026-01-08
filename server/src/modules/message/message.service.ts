import mongoose from "mongoose";
import { User } from "../user/user.model";
import { Guest } from "../guest/guest.model";
import { Chat } from "../chat/chat.model";
import { Message } from "./message.model";

interface SendMessagesFuncProps {
  sender: string;
  recipientUserId: string;
  content: string;
}
export async function saveSendMessage({
  sender,
  recipientUserId,
  content,
}: SendMessagesFuncProps): Promise<{
  message: SendMessagesFuncProps;
}> {
  const findReceivedUser =
    (await User.findById(recipientUserId)) ||
    (await Guest.findById(recipientUserId));

  if (!sender || !findReceivedUser) {
    throw new Error("No sender or recipient found");
  }

  let chat = await Chat.findOne({
    participants: {
      $all: [sender, recipientUserId].map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    },
  });
  // console.log("chat 1", chat);

  if (!chat) {
    chat = await Chat.create({
      participants: [sender, recipientUserId].map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    });
  }
  // console.log("chat 2", chat._id);

  const newMessageDoc = new Message({
    chatId: chat._id,
    sender,
    recipientUserId,
    content,
  });

  // console.log("chat 3", chat);
  await newMessageDoc.save();

  const newMessage: SendMessagesFuncProps = {
    sender,
    recipientUserId,
    content,
  };

  return { message: newMessage };
}
