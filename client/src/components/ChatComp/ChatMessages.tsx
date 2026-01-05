import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import type { Message } from "@/types/Message";

export const ChatMessages = ({ messages }: { messages?: Message[] }) => {
  if (!messages) return null;

  const currentUser = {
    userId: "Admin1",
    firstName: "X",
    lastName: "Y",
    avatarUrl: "XX",
    online: true,
  };

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto">
      <div className="space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${
              message.sender.userId === currentUser.userId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div className={`max-w-[85%] md:max-w-[70%]`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender.userId === currentUser.userId
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted rounded-bl-none"
                }`}
              >
                <p className="text-sm md:text-base">{message.content}</p>
                <p className="text-sm md:text-base">
                  {message.timestamp.toDateString()}
                </p>
              </div>
              <div
                className={`text-xs text-muted-foreground mt-1 px-2 ${
                  message.sender.userId === currentUser.userId
                    ? "text-right"
                    : "text-left"
                }`}
              ></div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
};
