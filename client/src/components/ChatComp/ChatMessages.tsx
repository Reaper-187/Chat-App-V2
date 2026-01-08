import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import type { Chat } from "@/types/Chat";

interface ChatMessagesProps {
  participants?: Chat["participants"];
  messages?: Chat["messages"];
}

export const ChatMessages = ({
  participants = [],
  messages = [],
}: ChatMessagesProps) => {
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
          return (
            <div
              key={index}
              className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%]`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isFromMe
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  <p className="text-sm md:text-base">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp &&
                      new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
                <div
                  className={`text-xs text-muted-foreground mt-1 px-2 ${
                    isFromMe ? "text-right" : "text-left"
                  }`}
                >
                  {message.timestamp &&
                    new Date(message.timestamp).toLocaleDateString([], {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
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
