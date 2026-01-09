import type { User } from "@/types/User";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export const ChatHeader = ({ user }: { user?: User }) => {
  if (!user) return null;

  const { userId, firstName, lastName, avatarUrl, online } = user;

  return (
    <header className="p-4 border-b bg-card shrink-0">
      <div className="flex items-center gap-3" key={userId}>
        <Avatar className="h-10 w-10 rounded-full border-1 border-black flex items-center justify-center">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            {firstName[0]}
            {lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex">
            <h1 className="font-semibold text-lg">{firstName}</h1>
            <h1 className="font-semibold text-lg">{lastName}</h1>
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`h-2 w-2 rounded-full ${
                online ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <p className="text-sm text-muted-foreground">
              {online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
