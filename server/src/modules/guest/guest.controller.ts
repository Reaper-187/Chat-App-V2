import { Request, Response } from "express";
import mongoose from "mongoose";
import { Guest } from "./guest.model";

exports.guestAccess = async (req: Request, res: Response) => {
  try {
    const guestId = new mongoose.Types.ObjectId();

    const newGuest = new Guest({
      _id: guestId,
      userRole: "guest",
      firstName: "Guest",
      lastName: `User-${guestId.toString().slice(-6)}`,
      email: `guest-${guestId}@temp.com`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), //Auto. Lösch-Datum
    });

    await newGuest.save();

    req.session.userId = newGuest._id.toString();
    req.session.userRole = newGuest.userRole;
    req.session.guestExpires = newGuest.expiresAt;
    req.session.save();

    res.status(200).json({ message: "Welcome Guest" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
