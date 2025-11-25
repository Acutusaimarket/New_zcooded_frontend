import { HistoryIcon, VideotapeIcon } from "lucide-react";

import { OverviewIcon } from "@/assets/icons/overview-icon";
import type { NestedLayoutItem } from "@/components/layout/nested-layout";

export const abTestingTabs = [
  {
    label: "Price Simulator",
    path: "/dashboard/ab-testing",
    icon: OverviewIcon,
  },
  {
    label: "Price Simulator History",
    path: "/dashboard/ab-testing/history",
    icon: HistoryIcon,
  },
] as NestedLayoutItem[];

export const mediaSimulationTabs = [
  {
    label: "Media Simulation",
    path: "/dashboard/media-simulation",
    icon: VideotapeIcon,
  },
  {
    label: "History",
    path: "/dashboard/media-simulation/history",
    icon: HistoryIcon,
  },
] as NestedLayoutItem[];
