import { useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
}

export const ChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey! Wie geht's?",
      sender: "other",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      content: "Alles gut bei mir! Hast du die Präsentation fertig?",
      sender: "user",
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: "3",
      content: "Ja, habe sie gerade hochgeladen.",
      sender: "other",
      timestamp: new Date(Date.now() - 900000),
    },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
      <div className="space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`max-w-[85%] md:max-w-[70%]`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted rounded-bl-none"
                }`}
              >
                <p className="text-sm md:text-base">{message.content}</p>
              </div>
              <div
                className={`text-xs text-muted-foreground mt-1 px-2 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
