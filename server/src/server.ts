if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import { Request, Response } from "express";
import { connectToDB } from "./config/db";
import { sessionSetup } from "./config/session";

import express from "express";
import cors from "cors";
import session from "express-session";
export const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const FRONTEND_URL = process.env.FRONTEND_URL
  ? String(process.env.FRONTEND_URL)
  : "http://localhost:5173";

const sessionMiddleware = session(sessionSetup());

app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  })
);
app.use(sessionMiddleware);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running");
});

async function startServer() {
  try {
    await connectToDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1);
  }
}

startServer();
