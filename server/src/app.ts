import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import { sessionSetup } from "./config/session";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running");
});
