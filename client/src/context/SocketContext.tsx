import type { Message } from "@/types/Message";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  sendMessageSocket: (payloade: SendMessage) => void;
  setIncomingHandler: (fn: (message: Message) => void) => void;
  onlineStatOfUsers: string[];
}

interface SendMessage {
  chatId: string;
  content: string;
  recipientUserId: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const incomingHandlerRef = useRef<((message: Message) => void) | null>(null);
  const [onlineStatOfUsers, setOnlineStatOfUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
    });
    const socket = socketRef.current;

    const statusHandler = (onlineUsers: string[]) => {
      setOnlineStatOfUsers(onlineUsers);
    };
    socket.on("users:online", statusHandler);

    return () => {
      socket.disconnect();
    };
  }, [user?.isAuthenticated]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const messagehandler = (message: Message) => {
      if (incomingHandlerRef.current) {
        incomingHandlerRef.current(message);
      }
    };

    socket.on("chat:message", messagehandler);
    return () => {
      socket.off("chat:message", messagehandler);
    };
  }, []);

  const setIncomingHandler = (fn: (message: Message) => void) => {
    incomingHandlerRef.current = fn;
  };

  const sendMessageSocket = (payload: SendMessage) => {
    socketRef.current?.emit("chat:message", payload);
  };

  return (
    <SocketContext.Provider
      value={{ sendMessageSocket, setIncomingHandler, onlineStatOfUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
