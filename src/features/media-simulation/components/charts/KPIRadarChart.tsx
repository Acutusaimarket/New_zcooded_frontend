import React from "react";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  type TooltipProps,
} from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import type { RadarChartData } from "../../utils/chart-helpers";

// Custom tooltip component to display rationales
const CustomRadarTooltip: React.FC<
  TooltipProps<number, string> & { data?: RadarChartData[] }
> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as RadarChartData;

  return (
    <div className="bg-background rounded-lg border p-3 shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold">{data.metric}</span>
          <span className="text-primary font-bold">
            {data.value.toFixed(1)}/100
          </span>
        </div>
        {data.rationale && (
          <div className="border-t pt-2">
            <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
              {data.rationale}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface KPIRadarChartProps {
  data: RadarChartData[];
  className?: string;
  height?: number;
}

export const KPIRadarChart = ({
  data,
  className = "",
  height = 400,
}: KPIRadarChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const chartConfig = {
    value: {
      label: "Score",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className={cn("w-full bg-transparent", className)} style={{ height }}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <RadarChart data={data} width={400}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 12 }}
            className="text-xs"
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="KPI Score"
            dataKey="value"
            stroke="var(--color-value)"
            fill="var(--color-value)"
            fillOpacity={0.5}
            dot={{
              r: 4,
              fillOpacity: 1,
            }}
          />
          <ChartTooltip
            cursor={false}
            content={<CustomRadarTooltip data={data} />}
          />
          <Legend />
        </RadarChart>
      </ChartContainer>
    </div>
  );
};
