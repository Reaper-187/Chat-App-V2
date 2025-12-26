import { ChatInput } from "@/components/ChatScreen/Chat-Input";
import { ChatHeader } from "@/components/ChatScreen/ChatHeader";
import { ChatMessages } from "@/components/ChatScreen/ChatMessages";

export const ChatMain = () => {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};
