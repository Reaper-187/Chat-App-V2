import { Request, Response, NextFunction } from "express";
import { Chat } from "./chat.model";
import { User } from "../user/user.model";

exports.getAllChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;

    const findAllRooms = await Chat.find({ participants: userId })
      .populate("participants", "firstName lastName avatarUrl online")
      .sort({ updatedAt: -1 });

    if (!findAllRooms || findAllRooms.length === 0) {
      return res.status(401).json({ message: "no Chats in History" });
    }

    const chatsWithChatId = findAllRooms.map((chat) => {
      const chatObj = chat.toObject();

      return {
        ...chatObj,
        chatId: chatObj._id.toString(),
        participants: chatObj.participants.map((p: any) => ({
          userId: p._id.toString(),
          firstName: p.firstName,
          lastName: p.lastName,
          avatarUrl: p.avatarUrl,
          online: p.online,
          userRole: p.userRole,
          isAuthenticated: true,
        })),
      };
    });

    res.status(200).json({ chats: chatsWithChatId });
  } catch (err) {
    res.status(500).json({ message: "Server Fehler", err });
  }
};

exports.getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).json({ message: "no permission" });
    }
    const userForSearch = await User.find(
      {},
      "firstName lastName avatarUrl email _id"
    );
    const allUser = userForSearch.map((user) => ({
      ...user.toObject(),
      userId: user._id,
    }));

    res.status(200).json(allUser);
  } catch (err) {
    res.status(500).json({ message: "Server Fehler", err });
  }
};
