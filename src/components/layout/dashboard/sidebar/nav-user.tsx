"use client";

import { Bell, CreditCard } from "lucide-react";
import { Link, Navigate } from "react-router";

import useLogoutMutation from "@/api/mutation/use-logout-mutation";
import { LoadingSwap } from "@/components/shared/loading-swap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";

import { CreditDisplay } from "./credit-display";

const getPlanDisplayName = (planType?: string): string => {
  if (!planType) return "Free";

  const planMap: Record<string, string> = {
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  return (
    planMap[planType.toLowerCase()] ||
    planType.charAt(0).toUpperCase() + planType.slice(1)
  );
};

export function NavUser() {
  const logoutMutation = useLogoutMutation();

  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const error = useAuthStore((state) => state.error);

  const currentPlanType = user?.enabled_plan?.plan_type || user?.plan_type;
  const currentPlanName = getPlanDisplayName(currentPlanType);

  const handleUpgradeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isLoading) {
    return <Skeleton className="border-input h-12 w-full border shadow-xl" />;
  }

  if (error && !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="mb-2">
        <CreditDisplay />
      </SidebarMenuItem>
      {/* <SidebarMenuItem className="mt-2">
        <SidebarMenuButton
          size="lg"
          onClick={handleUpgrade}
          className="border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground hover:bg-sidebar-accent flex w-full items-center justify-between rounded-lg border px-3 py-3"
        >
          <div className="text-left">
            <div className="text-muted-foreground text-xs">
              Current Plan:{" "}
              <span className="text-sidebar-foreground font-medium">
                {currentPlanName}
              </span>
              <span className="text-sidebar-foreground font-medium">
                &nbsp;&nbsp;&nbsp;Upgrade
              </span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4" />
        </SidebarMenuButton>
      </SidebarMenuItem> */}

      <SidebarMenuItem>
        <DropdownMenu>
          <div className="bg-background/30 border-border/20 hover:bg-background/40 hover:border-border/30 relative cursor-pointer rounded-lg">
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="w-full pr-20">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user?.first_name} />
                  <AvatarFallback className="rounded-lg">
                    {`${user?.first_name?.charAt(0).toUpperCase()}${user?.last_name?.charAt(0).toUpperCase()}` ||
                      "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium capitalize">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-secondary-foreground text-xs">
                    {currentPlanName}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <Button
              className="absolute top-1.5 right-1.5 h-auto rounded-full px-1.5 py-1 text-xs"
              variant={"secondary"}
              size={"sm"}
              asChild
            >
              <Link to="/plans" onClick={handleUpgradeClick}>
                Upgrade
              </Link>
            </Button>
          </div>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-sm"
            side="top"
            align="center"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user?.first_name} />
                  <AvatarFallback className="rounded-lg">
                    {`${user?.first_name?.charAt(0).toUpperCase()}${user?.last_name?.charAt(0).toUpperCase()}` ||
                      "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.first_name}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <CreditCard className="text-muted-foreground size-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Bell className="text-muted-foreground size-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                className="w-full"
                onClick={() => logoutMutation.mutate()}
              >
                <LoadingSwap isLoading={logoutMutation.isPending}>
                  {/* <LogOut className="text-muted-foreground size-4" /> */}
                  Log out
                </LoadingSwap>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
