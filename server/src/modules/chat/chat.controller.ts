import { Request, Response, NextFunction } from "express";
import { Chat } from "./chat.model";

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

    res.status(200).json({ chats: findAllRooms });
  } catch (err) {
    res.status(500).json({ message: "Server Fehler", err });
  }
};
