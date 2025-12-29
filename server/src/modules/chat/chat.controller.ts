import { Request, Response, NextFunction } from "express";
import { Chat } from "./chat.model";
import crypto from "crypto";
import { User } from "../user/user.model";

exports.createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    const { receiverId, content } = req.body;

    const findreceivedUser = await User.findById(receiverId);

    if (!findreceivedUser)
      return res.status(403).json({ message: "unauthorized action" });

    const findRoom = await Chat.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (findRoom)
      return res.status(200).json({ message: "Chat looks good :)" });

    const newChat = new Chat({
      participants: [userId, receiverId],
      lastMessage: content,
    });

    await newChat.save();

    res.status(200).json({ message: "Chat looks good :)" });
  } catch (err) {
    res.status(500).json({ message: "Server Fehler", err });
  }
};

exports.getAllChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;

    const findAllRooms = await Chat.find({ participants: userId })
      .populate("participants", "firstName lastName avatarUrl online") // sofort daten für die UI
      .sort({ updatedAt: -1 }); // zegit letzten kontakt zuerst an

    if (!findAllRooms)
      return res.status(401).json({ message: "no Chats in History" });

    res.status(200).json({ message: "Chat looks good :)" });
  } catch (err) {
    res.status(500).json({ message: "Server Fehler", err });
  }
};
