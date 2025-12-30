import { Request, Response, NextFunction } from "express";
import { User } from "../user/user.model";
import { Message } from "./message.model";
import { Chat } from "../chat/chat.model";

exports.sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    const { receiverId, content } = req.body;

    const findreceivedUser = await User.findById(receiverId);

    if (!userId || !findreceivedUser)
      return res.status(401).json({ message: "Error: Please try later" });

    let chat = await Chat.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [userId, receiverId],
      });
    }

    const newMessage = new Message({
      chatId: chat?._id,
      senderId: userId,
      content,
    });

    await newMessage.save();
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
