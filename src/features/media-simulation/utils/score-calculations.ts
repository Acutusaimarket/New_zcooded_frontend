import { getScoreCategory } from "../constants/performance-thresholds";
import type {
  KPIMetrics,
  MediaAnalysis,
} from "../types/media-simulation.types";

export const calculateOverallScore = (kpiMetrics: KPIMetrics): number => {
  const weights = {
    engagement_potential: 0.15,
    message_clarity: 0.15,
    emotional_impact: 0.1,
    brand_consistency: 0.15,
    conversion_potential: 0.2,
    production_quality: 0.1,
    relevance_score: 0.15,
  };

  const weightedSum = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (kpiMetrics[key as keyof KPIMetrics] as number) * weight;
  }, 0);

  return Math.round(weightedSum); // Already in 0-100 scale
};

export const getPerformanceLevel = (
  score: number,
  maxScore: number = 100
): string => {
  const category = getScoreCategory(score, maxScore);
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const calculateRiskScore = (analysis: MediaAnalysis): number => {
  // Calculate risk based on low scores in critical metrics
  const criticalMetrics = [
    analysis.kpi_metrics.message_clarity,
    analysis.kpi_metrics.brand_consistency,
  ];

  const lowScoreCount = criticalMetrics.filter((score) => score < 50).length;
  return (lowScoreCount / criticalMetrics.length) * 100;
};

export const compareAnalyses = (
  analysis1: MediaAnalysis,
  analysis2: MediaAnalysis
): {
  winner: MediaAnalysis;
  comparison: Record<string, { better: string; difference: number }>;
} => {
  const metrics = Object.keys(analysis1.kpi_metrics) as Array<keyof KPIMetrics>;
  const comparison: Record<string, { better: string; difference: number }> = {};

  metrics.forEach((metric) => {
    const score1 = analysis1.kpi_metrics[metric] as number;
    const score2 = analysis2.kpi_metrics[metric] as number;
    const difference = Math.abs(score1 - score2);

    comparison[metric] = {
      better: score1 > score2 ? analysis1.analysis_id : analysis2.analysis_id,
      difference,
    };
  });

  const winner =
    analysis1.kpi_metrics.overall_effectiveness >
    analysis2.kpi_metrics.overall_effectiveness
      ? analysis1
      : analysis2;

  return { winner, comparison };
};

export const calculateConfidenceInterval = (
  score: number,
  sampleSize: number = 100
): { lower: number; upper: number } => {
  // Simple confidence interval calculation
  const margin = 1.96 * Math.sqrt((score * (100 - score)) / sampleSize);
  return {
    lower: Math.max(0, score - margin),
    upper: Math.min(100, score + margin),
  };
};

export const normalizeScore = (
  score: number,
  currentMin: number,
  currentMax: number,
  targetMin: number = 0,
  targetMax: number = 100
): number => {
  return (
    ((score - currentMin) / (currentMax - currentMin)) *
      (targetMax - targetMin) +
    targetMin
  );
};
