import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";

export const ChatHeader = () => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <header className="p-4 border-b bg-card shrink-0">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa" />
          <AvatarFallback>LM</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-lg">Lisa Müller</h1>
          <div className="flex items-center gap-1">
            <div
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <p className="text-sm text-muted-foreground">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
