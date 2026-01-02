import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { corsSetup, sessionSetup } from "./config/session";
import { checkUserAuth } from "./middleware/auth.middleware";
import { checkGuestExpiry } from "./middleware/guest.auth.middleware";
// socket arbeitet nicht mit req,res,next sondern nur mit socket,next daher
// Wrapper-Funktion
const wrap = (middleware: any) => (socket: any, next: any) => {
  middleware(socket.request, {} as any, next);
};

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
    } catch (err: any | undefined) {
      next(err);
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  return io;
}
