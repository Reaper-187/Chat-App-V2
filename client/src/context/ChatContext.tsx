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

interface ChatContextType {
  activeChat: Chat | null;
  setActiveChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  handleSendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["messages", activeChat?.chatId],
    queryFn: () => getMessages(activeChat!.chatId!),
    enabled: !!activeChat?.chatId,
  });

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
  }, [data]);

  const currentUser = {
    userId: "Admin1",
    firstName: "X",
    lastName: "Y",
    avatarUrl: "XX",
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      messageId: "17",
      sender: currentUser.userId,
      content,
      timestamp: new Date(),
    };

    setActiveChat((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        messages: [...(prev.messages ?? []), newMessage],
      };
    });
  };

  return (
    <ChatContext.Provider
      value={{ activeChat, setActiveChat, handleSendMessage }}
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
