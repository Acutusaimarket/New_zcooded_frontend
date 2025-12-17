import * as React from "react";

import { Lock, type LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { toast } from "sonner";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  submenu?: {
    title: string;
    url: string;
    icon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[];
}

export function NavWithExpandableSubmenu({
  items,
  ...props
}: {
  items: NavItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { pathname } = useLocation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        {props.children}
        <SidebarMenu>
          {items.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            if (hasSubmenu) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton size={"lg"} asChild tooltip={item.title}>
                      <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <div className="flex w-full items-center gap-1 text-base font-medium">
                          {item.icon && <item.icon className="size-[1.3em]" />}
                          <span>{item.title}</span>
                        </div>
                      </CollapsibleTrigger>
                    </SidebarMenuButton>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.submenu?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={pathname === subItem.url}
                              size="md"
                              asChild
                              className={cn(
                                "data-[active=true]:bg-primary! data-[active=true]:text-primary-foreground! px-2 py-2 transition-colors data-[active=true]:shadow-xl"
                              )}
                            >
                              <NavLink to={subItem.url}>
                                {subItem.icon && (
                                  <subItem.icon
                                    className={cn(
                                      pathname === subItem.url &&
                                        "stroke-primary-foreground"
                                    )}
                                  />
                                )}
                                <span>{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // Check if this is the Library item (locked)
            const isLibrary = item.title === "Library";

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild={!isLibrary}
                  size="lg"
                  isActive={pathname === item.url}
                  onClick={
                    isLibrary
                      ? (e) => {
                          e.preventDefault();
                          toast.info("Coming soon", {
                            description: "Library feature is coming soon!",
                          });
                        }
                      : undefined
                  }
                  className={cn(
                    isLibrary && "cursor-not-allowed opacity-75"
                  )}
                >
                  {isLibrary ? (
                    <div
                      className={cn(
                        "flex w-full items-center gap-2 h-auto px-2 py-2 transition-colors"
                      )}
                    >
                      {item.icon && <item.icon className="size-[1.5em]" />}
                      <span className="text-base font-medium">{item.title}</span>
                      <Lock className="size-4 ml-auto" />
                    </div>
                  ) : (
                    <NavLink
                      to={item.url || ""}
                      className={cn(
                        "data-[active=true]:bg-primary! data-[active=true]:text-primary-foreground! h-auto px-2 py-2 transition-colors data-[active=true]:shadow-xl"
                      )}
                    >
                      {item.icon && <item.icon className="size-[1.5em]" />}
                      <span className="text-base font-medium">{item.title}</span>
                    </NavLink>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
