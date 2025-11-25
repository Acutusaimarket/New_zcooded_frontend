export const SCORE_COLORS = {
  excellent: "#10B981", // 8-10
  good: "#3B82F6", // 6-7
  average: "#F59E0B", // 4-5
  poor: "#EF4444", // 0-3
} as const;

export const STATUS_COLORS = {
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
} as const;

export const RISK_LEVEL_COLORS = {
  Low: "#10B981",
  Medium: "#F59E0B",
  High: "#EF4444",
} as const;

export const CHART_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
] as const;

export const KPI_COLORS = {
  engagement_potential: "#3B82F6",
  message_clarity: "#10B981",
  emotional_impact: "#F59E0B",
  brand_consistency: "#EF4444",
  conversion_potential: "#8B5CF6",
  production_quality: "#06B6D4",
  relevance_score: "#F97316",
  overall_effectiveness: "#84CC16",
} as const;
