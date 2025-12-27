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

// Contacts-lsit.
const contacts: User[] = [
  {
    userId: "user-1",
    firstName: "Lisa",
    lastName: "Müller",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    online: false,
  },
  {
    userId: "user-2",
    firstName: "Max",
    lastName: "Mustermann",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    online: true,
  },
];

export function AppSidebar() {
  const { setActiveChat } = useChat();

  const currentUser = {
    userId: "Admin1",
    firstName: "X",
    lastName: "Y",
    avatarUrl: "XX",
    online: true,
  };

  const handleActiveChat = (contact: User) => {
    setActiveChat({
      chatId: null,
      participants: [currentUser, contact],
    });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarSwitcher />
        <h2 className="px-4 py-2 text-lg font-semibold">Chats</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Contacts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contacts.map((contact) => (
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
