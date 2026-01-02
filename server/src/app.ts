import express, { Request, Response } from "express";
import cors from "cors";
import { corsSetup, sessionSetup } from "./config/session";
import { checkUserAuth } from "./middleware/auth.middleware";
import { checkGuestExpiry } from "./middleware/guest.auth.middleware";
import authRoutes from "./modules/user/user.routes";
import messageRoutes from "./modules/message/message.routes";
import chatRoutes from "./modules/chat/chat.routes";
import guestRoute from "./modules/guest/guest.routes";

export const app = express();

app.set("trust proxy", 1);

app.use(cors(corsSetup));

app.use(sessionSetup);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/auth", guestRoute);
app.use("/api", checkUserAuth, checkGuestExpiry, messageRoutes);
app.use("/api", checkUserAuth, checkGuestExpiry, chatRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running");
});
