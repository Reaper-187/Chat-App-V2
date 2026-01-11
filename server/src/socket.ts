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
const disconnectTimeouts = new Map<string, NodeJS.Timeout>();

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

    const existingTimeout = disconnectTimeouts.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      disconnectTimeouts.delete(userId);
    }

    // Alte Verbindung trennen, falls vorhanden
    const existingSocket = users.get(userId);
    if (existingSocket && existingSocket.id !== s.id) {
      existingSocket.disconnect();
    }

    users.set(userId, s);

    const onlineUsers: string[] = [...users.keys()];

    s.on("disconnect", () => {
      const disconnectTimeout = setTimeout(() => {
        // Prüfen ob User die gleiche Socket-conne hat
        if (users.get(userId) === s) {
          users.delete(userId);
          const onlineUsersAfterDis: string[] = [...users.keys()];
          io.emit("users:online", onlineUsersAfterDis);
        }

        // Timeout entfernen
        disconnectTimeouts.delete(userId);
      }, 3000);

      // Timeout speichern
      disconnectTimeouts.set(userId, disconnectTimeout);
    });

    console.log("disconnectTimeouts", disconnectTimeouts);

    socket.broadcast.emit("users:online", onlineUsers);
    socket.emit("users:online", onlineUsers);

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
