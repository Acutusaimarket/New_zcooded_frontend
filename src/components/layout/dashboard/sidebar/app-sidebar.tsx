import * as React from "react";

import { Box, Library, PlayCircle } from "@solar-icons/react";
import { Link } from "react-router";

import { NavUser } from "@/components/layout/dashboard/sidebar/nav-user";
import { NavWithExpandableSubmenu } from "@/components/layout/dashboard/sidebar/nav-with-expandable-submenu";
import { PersonaStudioWithHistory } from "@/components/layout/dashboard/sidebar/persona-studio-with-history";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import acutusAiLogo from "../../../../../public/hea.png";
import sidebarProp from "../../../../../public/sidbar_prop.png";
import type { NavItem } from "./nav-with-expandable-submenu";

const data = {
  navSecondary: [
    {
      title: "Product",
      url: "/dashboard/product",
      icon: Box,
    },
    {
      title: "Simulation",
      icon: PlayCircle,
      submenu: [
        {
          title: "Concept Test",
          url: "/dashboard/simulation",
          icon: PlayCircle,
        },
        {
          title: "Price Simulator",
          url: "/dashboard/ab-testing",
          icon: PlayCircle,
        },
        {
          title: "Media Measurement",
          url: "/dashboard/media-simulation",
          icon: PlayCircle,
        },
      ],
    },
    {
      title: "Library",
      url: "/dashboard/persona-lib",
      icon: Library,
    },
  ] as NavItem[],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar variant="inset" {...props}>
        <img
          src={sidebarProp}
          className="absolute right-0 bottom-0 z-1"
          alt="sidebarProp"
        />
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to={"/"}>
                  <div className="">
                    <img
                      src={acutusAiLogo}
                      className="size-10 object-contain"
                      alt="Acutus AI Logo"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xl font-semibold">
                      Zcoded
                    </span>
                    <span className="truncate text-xs">Gen Z Decoded</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="bg-transparent">
          {/* <PersonaStudioWithHistory /> */}
          <NavWithExpandableSubmenu items={data.navSecondary}>
            <div className="pb-1">
              <PersonaStudioWithHistory />
            </div>
          </NavWithExpandableSubmenu>
        </SidebarContent>
        <SidebarFooter className="z-10">
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
