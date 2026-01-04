import { Server, Socket } from "socket.io";
import { Server as HttpServer, IncomingMessage } from "http";
import { corsSetup, sessionSetup } from "./config/session";
import { checkUserAuth } from "./middleware/auth.middleware";
import { checkGuestExpiry } from "./middleware/guest.auth.middleware";
import { SessionData } from "express-session";
import { saveSendMessage } from "./modules/message/message.service";

// socket arbeitet nicht mit req,res,next sondern nur mit socket,next daher
// Wrapper-Funktion
const wrap = (middleware: any) => (socket: any, next: any) => {
  middleware(socket.request, {} as any, next);
};

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

const users = new Map<string, Socket>();

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: corsSetup,
  });

  io.engine.use(sessionSetup);

  io.use(async (socket, next) => {
    try {
      io.use(wrap(checkUserAuth));
      io.use(wrap(checkGuestExpiry));
      next();
    } catch (err: any) {
      next(err);
    }
  });

  io.on("connection", (defaultSocket: Socket) => {
    const socket = <SessionSocket>defaultSocket;
    const userId = socket.request.session.userId;

    // connection-events
    // Prüfen ob eine Verbindung existiert
    const existingSocket = users.get(userId);
    if (existingSocket) {
      existingSocket.disconnect();
    }

    // neue Verbindung setzen
    users.set(userId, socket);

    console.log("User connected", userId);

    socket.on("disconnect", () => {
      // Map cleanen wenn der User sich trennt
      if (users.get(userId) === socket) {
        users.delete(userId);
      }
      console.log("User disconnected", userId);
    });

    // User-Events

    socket.on("chat:message", async (sendMessagePayload: SendMessageProps) => {
      const { chatId, message } = await saveSendMessage({
        senderId: userId!,
        recipientId: sendMessagePayload.recipientUserId,
        content: sendMessagePayload.content,
      });

      const recipientSocket = users.get(sendMessagePayload.recipientUserId);
      if (recipientSocket)
        recipientSocket.emit("chat:message", { chatId, message });
    });

    return console.log("User Connected", userId);
  });

  return io;
}

// Ein Event besteht immer aus:

// Name (String)
// Payload (Daten)
// Richtung (Client → Server oder Server → Client)#
