import * as React from "react";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { KPIMetrics } from "../../types/media-simulation.types";

type KPIRatesBarChartProps = {
  kpi: KPIMetrics;
  height?: number;
  className?: string;
};

const RATE_KEYS = [
  "ad_recall_rate",
  "message_recall_rate",
  "brand_linkage_rate",
  // "affective_uplift",
  "brand_favorability_rate",
  "brand_consideration_uplift",
  "brand_trust_index",
  "creative_appeal_rate",
  "clarity_of_message_rate",
  "distinctiveness_score_rate",
  "simulated_share_intent_rate",
] as const;

const LABELS: Record<(typeof RATE_KEYS)[number], string> = {
  ad_recall_rate: "Ad Recall",
  message_recall_rate: "Message Recall",
  brand_linkage_rate: "Brand Linkage",
  // affective_uplift: "Affective Uplift",
  brand_favorability_rate: "Brand Favorability",
  brand_consideration_uplift: "Consideration Uplift",
  brand_trust_index: "Brand Trust",
  creative_appeal_rate: "Creative Appeal",
  clarity_of_message_rate: "Message Clarity",
  distinctiveness_score_rate: "Distinctiveness",
  simulated_share_intent_rate: "Share Intent",
};

export const KPIRatesBarChart: React.FC<KPIRatesBarChartProps> = ({
  kpi,
  height = 300,
  className,
}) => {
  const data = React.useMemo(
    () =>
      RATE_KEYS.map((key) => ({
        key,
        label: LABELS[key],
        // Most are percentages 0-100; ensure numeric and bounded
        value: Math.max(0, Math.min(100, Number(kpi[key]))),
      })),
    [kpi]
  );

  const config = React.useMemo(
    () =>
      RATE_KEYS.reduce(
        (acc, key, index) => {
          acc[key] = {
            label: LABELS[key],
            color: `var(--chart-${index + 1})` as string,
          };
          return acc;
        },
        {} as Record<string, { label: string; color: string }>
      ) satisfies ChartConfig,
    []
  );

  return (
    <Card className={className}>
      <ChartContainer config={config} className="p-4" id="kpi-rates">
        <BarChart data={data} height={height}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            interval={0}
            height={50}
          />
          <YAxis tickLine={true} axisLine={true} tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
          <Bar dataKey={"value"} fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </Card>
  );
};

export default KPIRatesBarChart;
