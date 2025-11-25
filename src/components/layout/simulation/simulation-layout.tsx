import { History } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";

import { OverviewIcon } from "@/assets/icons/overview-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const simulationTabs = [
  {
    label: "Overview",
    path: "/dashboard/simulation",
    icon: OverviewIcon,
  },
  {
    label: "Simulation History",
    path: "/dashboard/simulation/history",
    icon: History,
  },
];

const SimulationLayout = () => {
  const location = useLocation();

  return (
    <div>
      <header className="bg-background sticky top-0 z-50 pt-3">
        <ul className="border-b-border flex gap-2 overflow-x-auto border-b-2">
          {simulationTabs.map((tab) => (
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

export default SimulationLayout;
