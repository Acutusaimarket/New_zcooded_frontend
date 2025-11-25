import { Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router";

import { OverviewIcon } from "@/assets/icons/overview-icon";
import { PersonaStudioIcon } from "@/assets/icons/persona-studio.icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function PersonaStudioWithHistory() {
  const { pathname } = useLocation();

  return (
    <SidebarMenu>
      <Collapsible asChild className="group/collapsible" defaultOpen={true}>
        <SidebarMenuItem>
          <SidebarMenuButton size={"lg"} asChild tooltip="Persona Studio">
            <CollapsibleTrigger>
              <div className="flex w-full items-center gap-1 text-base font-medium">
                <PersonaStudioIcon className="size-[1.3em]" />
                <span>Persona Studio</span>
              </div>
            </CollapsibleTrigger>
          </SidebarMenuButton>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  isActive={pathname === "/dashboard/persona-studio"}
                  size="md"
                  asChild
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground px-2 py-2 transition-colors data-[active=true]:shadow-xl"
                >
                  <NavLink to="/dashboard/persona-studio">
                    <OverviewIcon className={cn("size-[1.5em] text-inherit")} />
                    <span>Studio Overview</span>
                  </NavLink>
                </SidebarMenuSubButton>
                <SidebarMenuSubButton
                  isActive={pathname === "/dashboard/persona-studio/chat"}
                  size="md"
                  asChild
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground px-2 py-2 transition-colors data-[active=true]:shadow-xl"
                >
                  <NavLink to="/dashboard/persona-studio/chat">
                    <Plus className={cn("size-[1.5em] text-inherit")} />
                    <span>Create New Chat</span>
                  </NavLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
