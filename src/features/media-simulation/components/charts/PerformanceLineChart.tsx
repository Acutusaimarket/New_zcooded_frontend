import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { CHART_COLORS } from "../../constants/chart-colors";

interface PerformanceLineChartProps {
  data: Array<{
    metric: string;
    [key: string]: string | number;
  }>;
  lines: Array<{
    dataKey: string;
    name: string;
    color?: string;
  }>;
  className?: string;
  height?: number;
}

export const PerformanceLineChart = ({
  data,
  lines,
  className = "",
  height = 300,
}: PerformanceLineChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-${height} ${className}`}
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Create chart configuration based on the lines prop
  const chartConfig: ChartConfig = lines.reduce((config, line, index) => {
    config[line.dataKey] = {
      label: line.name,
      color: line.color || CHART_COLORS[index % CHART_COLORS.length],
    };
    return config;
  }, {} as ChartConfig);

  return (
    <ChartContainer
      config={chartConfig}
      className={className}
      style={{ height }}
    >
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="metric"
          tick={{ fontSize: 12 }}
          // angle={-45}
          textAnchor="middle"
          height={60}
        />
        <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Metric: ${value}`}
              formatter={(value, name) => [
                typeof value === "number" ? value.toFixed(1) : value,
                `  ${name}`,
              ]}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color || CHART_COLORS[index % CHART_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};
