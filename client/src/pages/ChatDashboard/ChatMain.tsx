import { ChatInput } from "@/components/ChatScreen/Chat-Input";
import { ChatHeader } from "@/components/ChatScreen/ChatHeader";
import { ChatMessages } from "@/components/ChatScreen/ChatMessages";
import { useChat } from "@/context/ChatContext";

export const ChatMain = () => {
  const { activeChat } = useChat();
  const currentUser = {
    userId: "Admin1",
    firstName: "X",
    lastName: "Y",
    avatarUrl: "XX",
    online: true,
  };

  const otherUser = activeChat?.participants.find(
    (u) => u.userId !== currentUser.userId
  );

  return (
    <>
      {!otherUser ? (
        <p className="flex justify-self-center text-2xl">
          Please Select one of your Contacts
        </p>
      ) : (
        <div className="flex flex-col h-full max-h-screen">
          <ChatHeader user={otherUser} />
          <ChatMessages messages={activeChat?.messages} />
          <ChatInput />
        </div>
      )}
    </>
  );
};
