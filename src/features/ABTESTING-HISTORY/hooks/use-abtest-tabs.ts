import { useMemo } from "react";

import { parseAsStringEnum, useQueryState } from "nuqs";

/**
 * Available tab values for AB Test details
 */
export type ABTestTab = "overview" | "product-details";

/**
 * Custom hook for managing AB Test details tab state with URL synchronization
 */
export const useABTestTabs = () => {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringEnum(["overview", "product-details"]).withDefault("overview")
  );

  const tabs = useMemo(
    () => [
      {
        value: "overview" as const,
        label: "Overview",
        description: "Test analysis and variant comparison",
      },
      {
        value: "product-details" as const,
        label: "Product/Persona Details",
        description: "Comprehensive product variants information",
      },
    ],
    []
  );

  const getTabInfo = (tabValue: ABTestTab) => {
    return tabs.find((tab) => tab.value === tabValue);
  };

  const isTabActive = (tabValue: ABTestTab) => {
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
