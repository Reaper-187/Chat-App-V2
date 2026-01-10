import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useChat } from "@/context/ChatContext";

interface ChatInputProps {
  isLoading: boolean;
}

export const ChatInput = ({ isLoading }: ChatInputProps) => {
  const { handleSendMessage } = useChat();

  const [newMessage, setNewMessage] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(newMessage);
      setNewMessage("");
      e.preventDefault();
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    handleSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="border-t p-3 md:p-4 bg-card shrink-0">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nachricht schreiben..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 text-base"
          disabled={isLoading ? true : false}
        />
        <Button
          disabled={!newMessage.trim()}
          size="icon"
          className="h-10 w-10 md:h-11 md:w-11"
          onClick={sendMessage}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Drücke Enter zum Senden • Shift+Enter für neue Zeile
      </p>
    </div>
  );
};
