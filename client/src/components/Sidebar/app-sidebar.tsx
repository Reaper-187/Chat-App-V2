import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarSwitcher } from "./SidebarSwitcher";
import type { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChat } from "@/context/ChatContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getChat } from "@/service/chatService";
import { useAuth } from "@/context/AuthContext";
import { SearchInput } from "../SearchInput/SearchInput";
import type { Chat } from "@/types/Chat";

export function AppSidebar() {
  const [chatState, setChatState] = useState<{ chats: Chat[] } | null>(null);
  const { handleActiveChat } = useChat();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chat"],
    queryFn: getChat,
  });

  useEffect(() => {
    if (data) {
      setChatState(data); // Speichere gesamte Daten im State
    }
  }, [data]);

  const handleOpenChat = (userId: string) => {
    if (!chatState?.chats) return;

    const chatObj = chatState.chats.find((chat) =>
      chat.participants.some((p: any) => p.userId === userId)
    );

    if (!chatObj) return;
    handleActiveChat(chatObj);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarSwitcher />
        <SearchInput />
        <h2 className="px-4 py-2 text-lg font-semibold">Chats</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Contacts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatState?.chats?.map((chat) => {
                const contact = chat.participants.find(
                  (p: any) => p.userId !== user?.userId
                );

                if (!contact) return null;

                return (
                  <SidebarMenuItem key={contact.userId}>
                    <SidebarMenuButton
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                      onClick={() => handleOpenChat(contact.userId)}
                    >
                      <div className="relative">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={contact.avatarUrl} />
                          <AvatarFallback>
                            {contact.firstName[0]}
                            {contact.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                            contact.online ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <p>{contact.firstName}</p>
                        <p>{contact.lastName}</p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
