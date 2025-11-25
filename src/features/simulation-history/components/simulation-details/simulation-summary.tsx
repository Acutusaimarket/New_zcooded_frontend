// import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricInfoTooltip } from "@/components/ui/metric-info-tooltip";
import { Progress } from "@/components/ui/progress";

// import { Separator } from "@/components/ui/separator";

import type { SimulationDetails } from "../../types/simulation.types";
import {
  calculateProgress,
  getInterestLevelColor,
  getPmfIndexColor,
  getPricePerceptionColor,
  getPurchaseIntentColor,
} from "../../utils/simulation.utils";

interface SimulationSummaryProps {
  simulation: SimulationDetails;
}

export const SimulationSummary = ({ simulation }: SimulationSummaryProps) => {
  const { summary } = simulation;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary & Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Overall Interest Level
                </span>
                <MetricInfoTooltip
                  title="Overall Interest Level"
                  description=""
                />
              </div>
              <span
                className={`text-sm font-semibold ${getInterestLevelColor(summary.overall_interest_level)}`}
              >
                ({summary.overall_interest_level}/10)
              </span>
            </div>
            <Progress
              value={calculateProgress(summary.overall_interest_level)}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Overall Purchase Intent
                </span>
                <MetricInfoTooltip
                  title="Overall Purchase Intent"
                  description=""
                />
              </div>
              <span
                className={`text-sm font-semibold ${getPurchaseIntentColor(summary.overall_purchase_intent)}`}
              >
                ({summary.overall_purchase_intent}/10)
              </span>
            </div>
            <Progress
              value={calculateProgress(summary.overall_purchase_intent)}
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Overall Price Perception
              </span>
              <MetricInfoTooltip
                title="Overall Price Perception"
                description=""
              />
            </div>
            <Badge
              variant="outline"
              className={getPricePerceptionColor(
                summary.overall_price_perception
              )}
            >
              {summary.overall_price_perception}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">PMF Index</span>
                <MetricInfoTooltip title="PMF Index" description="" />
              </div>
              <span
                className={`text-sm font-semibold ${getPmfIndexColor(summary.overall_pmf_index)}`}
              >
                {summary.overall_pmf_index.toFixed(1)}
              </span>
            </div>
            <Progress
              value={Math.min(100, (summary.overall_pmf_index / 10) * 100)}
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
