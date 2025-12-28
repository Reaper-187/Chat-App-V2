import { LogOut } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import { LogoutButton } from "../Logout/LogoutButton";
// import { useAuth } from "@/Context/AuthContext/AuthContext";

export const SidebarSwitcher = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild> */}
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <p>PB</p>
          </div>
          <div className="flex gap-2 leading-none border-b-2 border-b-indigo-500">
            <span className="font-medium">asdasdasdasd</span>
            <span className="font-medium">asdasdasdasd</span>
          </div>
          <LogOut className="ml-auto" />
        </SidebarMenuButton>
        {/* </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
