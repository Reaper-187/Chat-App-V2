import { createContext, useContext, useState, type ReactNode } from "react";
import { type Chat } from "@/types/Chat";

interface ChatContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  return (
    <ChatContext.Provider value={{ chats, setChats }}>
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
