import { Request, Response, NextFunction } from "express";
import { Message } from "./message.model";
import { Chat } from "../chat/chat.model";
import { saveSendMessage } from "./message.service";

exports.sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    const { newMessage } = req.body;

    if (!userId || !newMessage.recipientUserId || !newMessage.content) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    await saveSendMessage({
      sender: userId,
      recipientUserId: newMessage.recipientUserId,
      content: newMessage.content,
    });

    res.status(200).json({ message: "Message saved" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    const { chatId: _id } = req.params;
    if (!userId) return res.status(401).json({ message: "Internal Error" });

    const findChat = await Chat.findOne({ _id });
    if (!findChat) return res.status(403).json({ message: "not possible" });

    const isUserParticipant = findChat.participants
      .map(String)
      .includes(userId);

    if (!isUserParticipant)
      return res.status(403).json({ message: "no possible" });

    const messages = await Message.find({ chatId: findChat._id }).sort({
      timeStamp: 1,
    });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
