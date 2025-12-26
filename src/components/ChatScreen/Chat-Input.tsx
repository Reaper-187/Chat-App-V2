import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

export const ChatInput = () => {
  const [input, setInput] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };
  return (
    <div className="border-t p-3 md:p-4 bg-card shrink-0">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nachricht schreiben..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 text-base"
        />
        <Button
          disabled={!input.trim()}
          size="icon"
          className="h-10 w-10 md:h-11 md:w-11"
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
