import type { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";
import { useSocket } from "@/context/SocketContext";

interface ChatHeaderProps {
  otherUser?: User | null;
  isLoading: boolean;
}

export const ChatHeader = ({ otherUser, isLoading }: ChatHeaderProps) => {
  const { onlineStatOfUsers } = useSocket();

  if (isLoading) {
    return (
      <header className="p-4 border-b bg-card shrink-0">
        <div className="flex items-center gap-3">
          {/* img */}
          <Skeleton className="h-10 w-10 rounded-full" />

          {/* name */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </header>
    );
  }

  if (!otherUser) return null;

  const { userId, firstName, lastName, avatarUrl } = otherUser;

  return (
    <header className="p-4 border-b bg-card shrink-0">
      <div className="flex items-center gap-3" key={userId}>
        <Avatar className="h-10 w-10 rounded-full border-1 border-black flex items-center justify-center relative">
          <AvatarImage src={avatarUrl} className="rounded-full" />
          <AvatarFallback className="rounded-full bg-muted flex items-center justify-center">
            {firstName?.[0]}
            {lastName?.[0]}
          </AvatarFallback>
          <div
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
              onlineStatOfUsers.includes(userId) ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <h1 className="font-semibold text-lg">{firstName}</h1>
            <h1 className="font-semibold text-lg">{lastName}</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
