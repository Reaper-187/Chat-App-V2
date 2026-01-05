import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { io, Socket } from "socket.io-client";

interface SocketContextType {
  sendMessageSocket: (payloade: SendMessage) => void;
}

interface SendMessage {
  chatId: string;
  content: string;
  recipient: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        withCredentials: true,
      });
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current?.on("chat:message", (message) => {
      console.log(message);
    });

    return () => {
      socketRef.current?.off("chat:message");
    };
  }, []);

  const sendMessageSocket = (payload: SendMessage) => {
    if (!socketRef.current) return;
    socketRef.current.emit("chat:message", payload);
  };

  return (
    <SocketContext.Provider value={{ sendMessageSocket }}>
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
