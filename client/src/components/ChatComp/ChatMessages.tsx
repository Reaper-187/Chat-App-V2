import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import type { Chat } from "@/types/Chat";
import { Spinner } from "../Spinner/Spinner";

interface ChatMessagesProps {
  messages?: Chat["messages"];
  isLoading: boolean;
}

export const ChatMessages = ({
  messages = [],
  isLoading = false,
}: ChatMessagesProps) => {
  const { user } = useAuth();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <ScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto">
        <div className="h-full flex items-center justify-center">
          <div>
            <Spinner />
          </div>
          <div>
            <p className="text-muted-foreground">loading chat conversation</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  // Wenn kein User, nichts anzeigen
  if (!user) return null;

  if (messages.length === 0) {
    return (
      <ScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto">
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">start conversation</p>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto">
      <div className="space-y-4 pb-4">
        {messages.map((message, index) => {
          const isFromMe = message.sender === user.userId;
          return (
            <div
              key={index}
              className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%]`}>
                <div
                  className={`rounded-2xl px-4 py-3 flex flex-col ${
                    isFromMe
                      ? "bg-primary text-primary-foreground rounded-br-none items-end"
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  <p className="text-sm md:text-base">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timeStamp &&
                      new Date(message.timeStamp).toLocaleDateString([], {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
};
