import * as React from "react";

import { type LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="lg">
                <NavLink
                  to={item.url}
                  className={cn(
                    "hover:border-l-primary hover:bg-primary/80 hover:text-primary-foreground h-auto transform-gpu px-2 py-2 transition-all hover:border-l-2",
                    pathname === item.url
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
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
