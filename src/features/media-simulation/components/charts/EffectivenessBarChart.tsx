import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  Effectiveness: {
    label: "Effectiveness",
    color: "var(--chart-1)",
  },
  Engagement: {
    label: "Engagement",
    color: "var(--chart-2)",
  },
  Clarity: {
    label: "Clarity",
    color: "var(--chart-3)",
  },
  Conversion: {
    label: "Conversion",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface EffectivenessBarChartProps {
  data: Array<{
    mediaId: string;
    Effectiveness: number;
    Engagement: number;
    Clarity: number;
    Conversion: number;
  }>;
  className?: string;
  height?: number;
}

export const EffectivenessBarChart = ({
  data,
  className = "",
  height = 300,
}: EffectivenessBarChartProps) => {
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

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={data}>
          <CartesianGrid />
          <XAxis
            dataKey="mediaId"
            className="text-xs"
            tickMargin={10}
            tickFormatter={(value: string) =>
              `${value.substring(0, 10)}${value.length > 10 ? "..." : ""}`
            }
          />
          <YAxis tick={{ fontSize: 12 }} className="text-xs" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend fontSize={14} className="uppercase" />
          <Bar
            dataKey="Effectiveness"
            fill="var(--color-Effectiveness)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Engagement"
            fill="var(--color-Engagement)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Clarity"
            fill="var(--color-Clarity)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Conversion"
            fill="var(--color-Conversion)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
