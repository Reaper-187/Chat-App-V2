import express, { Request, RequestHandler, Response } from "express";
import cors from "cors";
import session from "express-session";
import { sessionSetup } from "./config/session";
// import { checkUserAuth } from "./middleware/auth.middleware";

import authRoutes from "./modules/user/user.routes";

export const app = express();

app.set("trust proxy", 1);

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(session(sessionSetup()));
app.use(express.json());
app.use("/auth", authRoutes);
// app.use("/api", checkUserAuth);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running");
});
