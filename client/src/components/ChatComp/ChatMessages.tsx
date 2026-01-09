import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import type { Chat } from "@/types/Chat";

interface ChatMessagesProps {
  messages?: Chat["messages"];
}

export const ChatMessages = ({ messages = [] }: ChatMessagesProps) => {
  const { user } = useAuth();
  if (!messages || !user) return null;
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto">
      <div className="space-y-4 pb-4">
        {messages.map((message, index) => {
          // Prüfe, wer der Absender der Nachricht ist
          const isFromMe = message.sender === user.userId;
          const timeLine =
            message.timeStamp &&
            new Date(message.timeStamp).toLocaleDateString([], {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
          console.log("timeLine", timeLine);

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
