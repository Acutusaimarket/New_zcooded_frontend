import React from "react";

import { ContextLayerDisplay } from "@/components/shared/context-layer-display";

// import { Award, BarChart3, Clock, TrendingUp, Users } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ABTestHistoryItem } from "../../types";
import { VariantComparisonGraph } from "./variant-comparison-graph";

interface ABTestOverviewProps {
  test: ABTestHistoryItem;
}

export const ABTestOverview: React.FC<ABTestOverviewProps> = ({ test }) => {
  // Statistical cards removed as requested

  return (
    <div className="space-y-6">
      {/* Stats Cards - Removed as requested */}

      {/* Key Information Cards - Removed as requested */}

      {/* Variant Comparison Graph */}
      <VariantComparisonGraph test={test} />

      <ContextLayerDisplay
        contextLayer={test.context_layer}
        title="Context Layer"
        // showEmpty={true}
      />
    </div>
  );
};
