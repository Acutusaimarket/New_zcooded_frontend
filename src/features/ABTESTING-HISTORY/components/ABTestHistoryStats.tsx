import React from "react";

import type { ABTestHistoryItem } from "../types";

interface ABTestHistoryStatsProps {
  tests: ABTestHistoryItem[];
  isLoading?: boolean;
}

export const ABTestHistoryStats: React.FC<ABTestHistoryStatsProps> = () => {
  // Stats cards have been removed as requested
  return null;
};
