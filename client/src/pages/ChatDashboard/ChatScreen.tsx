import { ChatInput } from "@/components/ChatComp/Chat-Input";
import { ChatHeader } from "@/components/ChatComp/ChatHeader";
import { ChatMessages } from "@/components/ChatComp/ChatMessages";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";

export const ChatScreen = () => {
  const { activeChat, isLoading } = useChat();
  const { user } = useAuth();
  const otherUser = activeChat?.participants.find(
    (u) => u.userId !== user?.userId
  );
  console.log(activeChat);

  return (
    <>
      {!otherUser ? (
        <p className="flex justify-self-center text-2xl">
          Select a Contact to start chattin 😊
        </p>
      ) : (
        <div className="flex flex-col h-full max-h-screen">
          <ChatHeader otherUser={otherUser} isLoading={isLoading} />
          <ChatMessages messages={activeChat?.messages} isLoading={isLoading} />
          <ChatInput isLoading={isLoading} />
        </div>
      )}
    </>
  );
};
