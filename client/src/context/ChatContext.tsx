import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Chat } from "@/types/Chat";
import type { Message } from "@/types/Message";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/service/chatService";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import type { User } from "@/types/User";

interface ChatContextType {
  activeChat: Chat | null;
  isLoading: boolean;
  handleActiveChat: (chat: Chat | User) => void;
  handleSendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { setIncomingHandler, sendMessageSocket } = useSocket();
  const { user } = useAuth();

  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["messages", activeChat?.chatId],
    queryFn: () => getMessages(activeChat?.chatId!),
    enabled: !!activeChat?.chatId,
  });

  const handleActiveChat = (data: Chat | User) => {
    if ("chatId" in data) {
      if (activeChat?.chatId === data.chatId) return;
      setActiveChat(data);
    }
    // Wenn es ein User ist wird ein neuer Chat erstellen
    else {
      const newChat: Chat = {
        chatId: null,
        participants: [user!, data],
        messages: [],
      };
      setActiveChat(newChat);
    }
  };

  useEffect(() => {
    if (!data || !activeChat) return;
    setActiveChat((prev) =>
      prev
        ? {
            ...prev,
            messages: data.messages,
          }
        : prev
    );
  }, [data, activeChat?.chatId]);

  const handleSendMessage = (content: string) => {
    if (!activeChat || !user) return;

    const newMessage: Message = {
      messageId: crypto.randomUUID(),
      sender: user.userId,
      recipientUserId: activeChat.participants.find(
        (p) => p.userId !== user?.userId
      )?.userId!,
      content,
      timeStamp: new Date(),
    };

    setActiveChat((prev) => {
      if (!prev) return prev;
      return { ...prev, messages: [...(prev.messages ?? []), newMessage] };
    });

    // Socket senden
    sendMessageSocket({
      chatId: activeChat.chatId!,
      recipientUserId: activeChat.participants.find(
        (p) => p.userId !== user.userId
      )?.userId!,
      content,
    });
  };

  const handleIncomingMessage = (message: Message) => {
    setActiveChat((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...(prev.messages ?? []), message],
      };
    });
  };

  useEffect(() => {
    setIncomingHandler(handleIncomingMessage);
  }, [handleIncomingMessage, setIncomingHandler]);

  return (
    <ChatContext.Provider
      value={{ activeChat, handleActiveChat, handleSendMessage, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
