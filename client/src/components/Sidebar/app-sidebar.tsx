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

export function AppSidebar() {
  const [chatContacts, setChatContacts] = useState<User[]>([]); // State für Contacts
  const { handleActiveChat } = useChat();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chat"],
    queryFn: getChat,
  });

  useEffect(() => {
    if (data?.chats) {
      const contactsFromChats: User[] = data.chats.map((chat: any) => {
        const contact = chat.participants.find(
          (p: any) => p._id !== user?.userId
        );
        return {
          userId: contact._id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          avatarUrl: contact.avatarUrl,
          online: contact.online,
          userRole: contact.userRole,
          isAuthenticated: true,
        };
      });
      setChatContacts(contactsFromChats);
    }
  }, [data]);

  if (isLoading) return <p>Loading chats...</p>;
  if (error) return <p>Error loading chats</p>;

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
              {chatContacts.map((contact) => (
                <SidebarMenuItem key={contact.userId}>
                  <SidebarMenuButton
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    onClick={() => handleActiveChat(contact)}
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
