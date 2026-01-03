import { Server, Socket } from "socket.io";
import { Server as HttpServer, IncomingMessage } from "http";
import { corsSetup, sessionSetup } from "./config/session";
import { checkUserAuth } from "./middleware/auth.middleware";
import { checkGuestExpiry } from "./middleware/guest.auth.middleware";
import { SessionData } from "express-session";

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

const users = new Map();

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

    return console.log("User Connected", userId);
  });

  return io;
}
