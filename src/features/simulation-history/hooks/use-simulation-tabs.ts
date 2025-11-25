import { useMemo } from "react";

import { parseAsStringEnum, useQueryState } from "nuqs";

/**
 * Available tab values for simulation details
 */
export type SimulationTab = "overview" | "persona-results" | "product-details";

/**
 * Custom hook for managing simulation details tab state with URL synchronization
 */
export const useSimulationTabs = () => {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringEnum([
      "overview",
      "persona-results",
      "product-details",
    ]).withDefault("overview")
  );

  const tabs = useMemo(
    () => [
      {
        value: "overview" as const,
        label: "Overview",
        description: "Basic simulation information and overall summary",
      },
      {
        value: "persona-results" as const,
        label: "Persona Results",
        description: "Detailed results for each persona tested",
      },
      {
        value: "product-details" as const,
        label: "Product Details",
        description: "Comprehensive product information and variants",
      },
    ],
    []
  );

  const getTabInfo = (tabValue: SimulationTab) => {
    return tabs.find((tab) => tab.value === tabValue);
  };

  const isTabActive = (tabValue: SimulationTab) => {
    return activeTab === tabValue;
  };

  return {
    activeTab,
    setActiveTab,
    tabs,
    getTabInfo,
    isTabActive,
  };
};
