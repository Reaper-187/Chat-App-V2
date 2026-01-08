import { ChatInput } from "@/components/ChatComp/Chat-Input";
import { ChatHeader } from "@/components/ChatComp/ChatHeader";
import { ChatMessages } from "@/components/ChatComp/ChatMessages";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";

export const ChatScreen = () => {
  const { activeChat } = useChat();
  const { user } = useAuth();
  const otherUser = activeChat?.participants.find(
    (u) => u.userId !== user?.userId
  );
  console.log(activeChat);

  return (
    <>
      {!otherUser ? (
        <p className="flex justify-self-center text-2xl">
          Please Select one of your Contacts
        </p>
      ) : (
        <div className="flex flex-col h-full max-h-screen">
          <ChatHeader user={otherUser} />
          <ChatMessages
            participants={activeChat?.participants}
            messages={activeChat?.messages}
          />
          <ChatInput />
        </div>
      )}
    </>
  );
};
