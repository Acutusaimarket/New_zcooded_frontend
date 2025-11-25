import { ChatRoundDots } from "@solar-icons/react-perf/BoldDuotone";
import { BrainCircuitIcon, UsersIcon } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";

import { OverviewIcon } from "@/assets/icons/overview-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const personaStudioTabs = [
  {
    label: "Overview",
    path: "/dashboard/persona-studio",
    icon: OverviewIcon,
  },
  {
    label: "Persona Chat Builder",
    path: "/dashboard/persona-studio/chat",
    icon: ChatRoundDots,
  },
  {
    label: "Persona Engine",
    path: "/dashboard/persona-studio/engine",
    icon: BrainCircuitIcon,
  },
  {
    label: "Persona Management",
    path: "/dashboard/persona-studio/management",
    icon: UsersIcon,
  },
  // {
  //   label: "Analytics",
  //   path: "/dashboard/persona-studio/analytics",
  //   icon: PieChartIcon,
  // },
];

const PersonaStudioLayout = () => {
  const location = useLocation();

  return (
    <div>
      <header className="bg-background sticky top-0 z-50 pt-3">
        <ul className="border-b-border flex gap-2 overflow-x-auto border-b-2">
          {personaStudioTabs.map((tab) => (
            <li key={tab.label}>
              <Button
                asChild
                variant={"ghost"}
                className={cn(
                  "h-auto rounded-none py-1 font-normal",
                  location.pathname === tab.path
                    ? "border-b-primary border-b-2 font-semibold"
                    : ""
                )}
              >
                <Link to={tab.path}>
                  {tab.icon && <tab.icon className="inline-block" />}
                  {tab.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default PersonaStudioLayout;
