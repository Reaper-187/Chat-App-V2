import { createContext, useContext, useState, type ReactNode } from "react";
import type { Chat } from "@/types/Chat";
import type { Message } from "@/types/Message";

interface ChatContextType {
  activeChat: Chat | null;
  setActiveChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  handleSendMessage: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const currentUser = {
    userId: "Admin1",
    firstName: "X",
    lastName: "Y",
    avatarUrl: "XX",
    online: true,
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      messageId: "17",
      sender: currentUser,
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
