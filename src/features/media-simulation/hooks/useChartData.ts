import { useMemo } from "react";

import type { MediaSimulationData } from "../types/media-simulation.types";
import {
  getBottomPerformingMetrics,
  getTopPerformingMetrics,
  transformKPIToBarData,
  transformKPIToRadarData,
  transformMultipleAnalysesComparison,
} from "../utils/chart-helpers";

export const useChartData = (data: MediaSimulationData | null) => {
  const radarChartData = useMemo(() => {
    if (!data?.individual_analysis?.length) return [];

    return data.individual_analysis.map((analysis) => ({
      analysisId: analysis.analysis_id,
      mediaId: analysis.media_id,
      personasId: analysis.persona_id,
      data: transformKPIToRadarData(analysis.kpi_metrics),
    }));
  }, [data]);

  const barChartData = useMemo(() => {
    if (!data?.individual_analysis?.length) return [];

    return data.individual_analysis.map((analysis) => ({
      analysisId: analysis.analysis_id,
      mediaId: analysis.media_id,
      personasId: analysis.persona_id,
      data: transformKPIToBarData(analysis.kpi_metrics),
    }));
  }, [data]);

  const comparisonData = useMemo(() => {
    if (!data?.individual_analysis || data.individual_analysis.length < 2)
      return [];

    return transformMultipleAnalysesComparison(data.individual_analysis);
  }, [data]);

  const performanceOverview = useMemo(() => {
    if (!data?.individual_analysis?.length) return [];

    return data.individual_analysis.map((analysis) => {
      const personaName = data.participated_personas.find(
        (persona) => persona._id === analysis.persona_id
      )?.name;
      return {
        mediaId: `${analysis.media_id.replace(/_[0-9a-fA-F-]{36}$/, "")} v/s ${personaName}`,
        Effectiveness: analysis.kpi_metrics.overall_effectiveness,
        Engagement: analysis.kpi_metrics.engagement_potential,
        Clarity: analysis.kpi_metrics.message_clarity,
        Conversion: analysis.kpi_metrics.conversion_potential,
      };
    });
  }, [data]);

  const topPerformers = useMemo(() => {
    if (!data?.individual_analysis?.length) return [];

    return data.individual_analysis.map((analysis) => ({
      analysisId: analysis.analysis_id,
      mediaId: analysis.media_id,
      metrics: getTopPerformingMetrics(analysis.kpi_metrics),
    }));
  }, [data]);

  const bottomPerformers = useMemo(() => {
    if (!data?.individual_analysis?.length) return [];

    return data.individual_analysis.map((analysis) => ({
      analysisId: analysis.analysis_id,
      mediaId: analysis.media_id,
      metrics: getBottomPerformingMetrics(analysis.kpi_metrics),
    }));
  }, [data]);

  // Commented out - will be used later when comparison_analysis is available
  const rankingData = useMemo(() => {
    // if (!data?.comparison_analysis?.ranking) return [];
    // return data.comparison_analysis.ranking.map((item) => ({
    //   ...item,
    //   mediaId:
    //     data.individual_analysis.find(
    //       (analysis) => analysis.analysis_id === item.analysis_id
    //     )?.media_id || "Unknown",
    //   effectiveness:
    //     data.individual_analysis.find(
    //       (analysis) => analysis.analysis_id === item.analysis_id
    //     )?.kpi_metrics.overall_effectiveness || 0,
    // }));
    return [];
  }, []);

  const averageScores = useMemo(() => {
    if (!data?.individual_analysis?.length) return null;

    const totalAnalyses = data.individual_analysis.length;
    const summedScores = data.individual_analysis.reduce(
      (acc, analysis) => {
        Object.entries(analysis.kpi_metrics).forEach(([key, value]) => {
          acc[key] = (acc[key] || 0) + value;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(summedScores).reduce(
      (acc, [key, sum]) => {
        acc[key] = sum / totalAnalyses;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [data]);

  return {
    radarChartData,
    barChartData,
    comparisonData,
    performanceOverview,
    topPerformers,
    bottomPerformers,
    rankingData,
    averageScores,
  };
};
