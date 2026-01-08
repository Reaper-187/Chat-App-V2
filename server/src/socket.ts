import { ExtendedError, Server, Socket } from "socket.io";
import { Server as HttpServer, IncomingMessage } from "http";
import { corsSetup, sessionSetup } from "./config/session";
import { checkUserAuth } from "./middleware/auth.middleware";
import { checkGuestExpiry } from "./middleware/guest.auth.middleware";
import { SessionData } from "express-session";
import { saveSendMessage } from "./modules/message/message.service";

// socket arbeitet nicht mit req,res,next sondern nur mit socket,next daher
// Wrapper-Funktion

// musste interface in der file schreiben sonst ERRORS OHNE ENDE
interface SessionIncomingMessage extends IncomingMessage {
  session: SessionData;
}

interface SessionSocket extends Socket {
  request: SessionIncomingMessage;
}

interface SendMessageProps {
  chatId: string | null;
  recipientUserId: string;
  content: string;
}

const wrap =
  (middleware: any) => (socket: any, next: (err?: ExtendedError) => void) => {
    const fakeRes = { locals: {} };
    try {
      middleware(socket.request, fakeRes as any, next);
    } catch (err: unknown) {
      // err auf ExtendedError casten
      next(err as ExtendedError);
    }
  };

const users = new Map<string, Socket>();

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: corsSetup,
  });

  // Session Middleware für Socket.IO
  io.engine.use(sessionSetup);

  // Socket Middleware für Auth
  io.use((socket: any, next) => {
    const s = socket as SessionSocket;

    if (!s.request.session) {
      return next(new Error("Session not found"));
    }

    // Nur die wrap-Middleware chainen
    wrap(checkUserAuth)(s, (err) => {
      if (err) return next(err);
      wrap(checkGuestExpiry)(s, next);
    });
  });

  // Verbindungs-Handling
  io.on("connection", (socket: any) => {
    const s = socket as SessionSocket;
    const userId = s.request.session.userId;

    if (!userId) {
      s.disconnect(true);
      return;
    }

    console.log("User Connected:", userId);

    // Alte Verbindung trennen
    const existingSocket = users.get(userId);
    if (existingSocket) existingSocket.disconnect();

    // Neue Verbindung setzen
    users.set(userId, s);

    // Disconnect sauber handhaben
    s.on("disconnect", () => {
      if (users.get(userId) === s) users.delete(userId);
      console.log("User Disconnected:", userId);
    });

    // Chat-Event
    s.on("chat:message", async (payload: SendMessageProps) => {
      const { message } = await saveSendMessage({
        sender: userId,
        recipientUserId: payload.recipientUserId,
        content: payload.content,
      });
      const recipientSocket = users.get(payload.recipientUserId);
      if (recipientSocket) recipientSocket.emit("chat:message", message);
    });
  });

  return io;
}

// Ein Event besteht immer aus:

// Name (String)
// Payload (Daten)
// Richtung (Client → Server oder Server → Client)#
