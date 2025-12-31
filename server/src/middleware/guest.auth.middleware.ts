import { NextFunction, Request, Response } from "express";
import { Guest } from "../modules/guest/guest.model";
import { Chat } from "../modules/chat/chat.model";
import { Message } from "../modules/message/message.model";

export const cleanupGuestData = async (guestId: string) => {
  const chats = await Chat.find({ participants: guestId });

  const chatIds = chats.map((c) => c._id);

  await Message.deleteMany({ chatId: { $in: chatIds } });
  await Chat.deleteMany({ _id: { $in: chatIds } });
  await Guest.findByIdAndDelete(guestId);
};

export const checkGuestExpiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, userRole } = req.session;

  if (!userId) {
    return next();
  }

  if (userRole === "guest") {
    const guest = await Guest.findById(userId);
    if (guest && guest.expiresAt < new Date()) {
      await cleanupGuestData(userId);
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return next(err);
        }
        return res.status(401).json({ message: "Guest session expired" });
      });
    }
  }
  next();
};
