import * as React from "react";

import { type LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  submenu?: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}

export function NavWithSubmenu({
  items,
  ...props
}: {
  items: NavItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.submenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton asChild size="lg">
                      <NavLink
                        to={item.url}
                        className={cn(
                          "hover:border-l-primary hover:bg-primary/80 hover:text-primary-foreground flex h-auto transform-gpu cursor-pointer items-center gap-2 px-2 py-2 transition-all hover:border-l-2",
                          pathname.startsWith(item.url.split("?")[0])
                            ? "bg-primary text-primary-foreground shadow-2xl"
                            : "border-l-0"
                        )}
                      >
                        <span>
                          <item.icon className="size-[1.5em]" />
                        </span>
                        <span className="text-base font-medium">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    sideOffset={5}
                    className="w-56"
                  >
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.title} asChild>
                        <NavLink
                          to={subItem.url}
                          className="flex w-full items-center gap-2"
                        >
                          {subItem.icon && <span>{subItem.icon}</span>}
                          <span>{subItem.title}</span>
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SidebarMenuButton asChild size="lg">
                  <NavLink
                    to={item.url}
                    className={cn(
                      "hover:border-l-primary hover:bg-primary/80 hover:text-primary-foreground h-auto transform-gpu px-2 py-2 transition-all hover:border-l-2",
                      pathname.startsWith(item.url.split("?")[0])
                        ? "bg-primary text-primary-foreground shadow-2xl"
                        : "border-l-0"
                    )}
                  >
                    <span>
                      <item.icon className="size-[1.5em]" />
                    </span>
                    <span className="text-base font-medium">{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
