import { CHART_COLORS, KPI_COLORS } from "../constants/chart-colors";
import { KPI_DEFINITIONS } from "../constants/kpi-definitions";
import type { KPIMetrics } from "../types/media-simulation.types";

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
  fullLabel?: string;
}

export interface RadarChartData {
  metric: string;
  value: number;
  fullMark: number;
  rationale?: string;
}

export const transformKPIToRadarData = (
  kpiMetrics: KPIMetrics
): RadarChartData[] => {
  const { rationales } = kpiMetrics;
  // Only include the eight core KPI scores in the radar chart
  const coreKeys: Array<keyof KPIMetrics> = [
    "engagement_potential",
    "message_clarity",
    "emotional_impact",
    "brand_consistency",
    "conversion_potential",
    "production_quality",
    "relevance_score",
    "overall_effectiveness",
  ];

  return coreKeys.map((key) => ({
    metric:
      KPI_DEFINITIONS[key as keyof typeof KPI_DEFINITIONS]?.label ||
      (key as string),
    value: kpiMetrics[key] as number,
    fullMark: 100,
    rationale: rationales?.[key as keyof typeof rationales],
  }));
};

export const transformKPIToBarData = (
  kpiMetrics: KPIMetrics
): ChartDataPoint[] => {
  return Object.entries(kpiMetrics).map(([key, value]) => ({
    label: KPI_DEFINITIONS[key as keyof typeof KPI_DEFINITIONS]?.label || key,
    value,
    color: KPI_COLORS[key as keyof typeof KPI_COLORS] || CHART_COLORS[0],
    fullLabel:
      KPI_DEFINITIONS[key as keyof typeof KPI_DEFINITIONS]?.description,
  }));
};

export const transformComparisonData = (
  kpiMetrics1: KPIMetrics,
  kpiMetrics2: KPIMetrics,
  label1: string = "Media 1",
  label2: string = "Media 2"
) => {
  return Object.entries(kpiMetrics1).map(([key, value1]) => ({
    metric: KPI_DEFINITIONS[key as keyof typeof KPI_DEFINITIONS]?.label || key,
    [label1]: value1,
    [label2]: kpiMetrics2[key as keyof KPIMetrics],
  }));
};

export const getMediaDisplayName = (
  analysis: { media_id: string; metadata?: { file_name?: string } },
  fallbackIndex?: number
): string => {
  // Try to get file name from metadata first
  if (analysis.metadata?.file_name) {
    // Remove file extension and return clean name
    return analysis.metadata.file_name.replace(/\.[^/.]+$/, "");
  }

  // Fallback to extracting from media_id
  const nameFromId = analysis.media_id.split("_")[0];
  if (nameFromId && nameFromId !== analysis.media_id) {
    return nameFromId;
  }

  // Final fallback to generic name with index
  return fallbackIndex !== undefined ? `Media ${fallbackIndex + 1}` : "Media";
};

export const transformMultipleAnalysesComparison = (
  analyses: Array<{
    kpi_metrics: KPIMetrics;
    media_id: string;
    analysis_id: string;
    metadata?: { file_name?: string };
  }>
) => {
  if (analyses.length === 0) return [];

  // Get all KPI metric keys from the first analysis, excluding rationales
  const { rationales: _rationales, ...metricsOnly } = analyses[0].kpi_metrics;
  const metricKeys = Object.keys(metricsOnly);

  return metricKeys.map((key) => {
    const metric =
      KPI_DEFINITIONS[key as keyof typeof KPI_DEFINITIONS]?.label || key;
    const dataPoint: { metric: string; [key: string]: string | number } = {
      metric,
    };

    // Add each analysis as a column in the comparison using actual media names
    analyses.forEach((analysis, index) => {
      const displayName = getMediaDisplayName(analysis, index);
      dataPoint[displayName] = analysis.kpi_metrics[
        key as keyof KPIMetrics
      ] as number;
    });

    return dataPoint;
  });
};

export const calculateAverageScore = (kpiMetrics: KPIMetrics): number => {
  const scores = Object.values(kpiMetrics);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatScore = (value: number, maxValue: number = 10): string => {
  return `${value.toFixed(1)}/${maxValue}`;
};

export const getTopPerformingMetrics = (
  kpiMetrics: KPIMetrics,
  count: number = 3
): Array<{ metric: string; value: number; label: string }> => {
  return Object.entries(kpiMetrics)
    .filter(([key]) => key !== "overall_effectiveness")
    .map(([key, value]) => ({
      metric: key,
      value,
      label: KPI_DEFINITIONS[key as keyof typeof KPI_DEFINITIONS]?.label || key,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
};

export const getBottomPerformingMetrics = (
  kpiMetrics: KPIMetrics,
  count: number = 3
): Array<{ metric: string; value: number; label: string }> => {
  return Object.entries(kpiMetrics)
    .filter(([key]) => key !== "overall_effectiveness")
    .map(([key, value]) => ({
      metric: key,
      value,
      label: KPI_DEFINITIONS[key as keyof typeof KPI_DEFINITIONS]?.label || key,
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, count);
};
