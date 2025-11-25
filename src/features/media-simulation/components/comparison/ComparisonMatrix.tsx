import { Crown, TrendingUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { MediaSimulationData } from "../../types/media-simulation.types";
import { getMediaDisplayName } from "../../utils/chart-helpers";
import { replaceUUIDs } from "../../utils/data-formatters";

interface ComparisonMatrixProps {
  data: MediaSimulationData;
  className?: string;
}

export const ComparisonMatrix = ({
  data,
  className,
}: ComparisonMatrixProps) => {
  const analyses = data.individual_analysis || [];
  const ranking = data.comparison_analysis?.ranking || [];

  if (analyses.length < 2) {
    return (
      <div className={cn("flex h-64 items-center justify-center", className)}>
        <p className="text-muted-foreground">
          At least 2 media files are required for comparison
        </p>
      </div>
    );
  }

  // Find the overall winner based on effectiveness scores
  const topAnalysis = analyses.reduce((best, current) =>
    current.kpi_metrics.overall_effectiveness >
    best.kpi_metrics.overall_effectiveness
      ? current
      : best
  );

  const topAnalysisIndex = analyses.findIndex(
    (a) => a.analysis_id === topAnalysis.analysis_id
  );
  const topScore = topAnalysis.kpi_metrics.overall_effectiveness;

  // Calculate the score difference with the second best
  const sortedByScore = [...analyses].sort(
    (a, b) =>
      b.kpi_metrics.overall_effectiveness - a.kpi_metrics.overall_effectiveness
  );
  const scoreDifference =
    sortedByScore.length > 1
      ? topScore - sortedByScore[1].kpi_metrics.overall_effectiveness
      : 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Overall Winner */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Media Comparison</h2>
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">
            {getMediaDisplayName(topAnalysis, topAnalysisIndex)}
            {scoreDifference > 0 && (
              <span className="text-muted-foreground ml-1">
                (+{scoreDifference.toFixed(1)} points)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Ranking Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ranking.map((rank) => {
          const analysis = analyses.find(
            (a) => a.analysis_id === rank.analysis_id
          );
          const personaName = data.participated_personas.find(
            (a) => a._id === analysis?.persona_id
          )?.name;

          return (
            <Card
              key={rank.analysis_id}
              className={cn(
                "relative",
                rank.rank === 1 && "ring-2 ring-yellow-400"
              )}
            >
              {rank.rank === 1 && (
                <div className="absolute -top-2 -right-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      className="aspect-square size-8"
                      variant={rank.rank === 1 ? "default" : "secondary"}
                    >
                      #{rank.rank}
                    </Badge>
                    <CardTitle className="truncate text-lg">
                      {analysis
                        ? `${personaName} v/s ${analysis.metadata.file_name}`
                        : `Media ${rank.rank}`}
                    </CardTitle>
                  </div>
                  <Badge variant="outline">
                    {analysis?.kpi_metrics.overall_effectiveness || 0}/100
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Progress
                  value={analysis?.kpi_metrics.overall_effectiveness || 0}
                  className="h-2"
                />

                <div className="prose prose-sm text-muted-foreground bg-muted prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-muted-foreground prose-blockquote:text-muted-foreground max-w-none rounded-md p-2">
                  <ReactMarkdown>
                    {replaceUUIDs(rank.justification, data)}
                  </ReactMarkdown>
                </div>

                {/* Quick KPI Comparison */}
                {analysis && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="text-sm font-medium">
                        {analysis.kpi_metrics.engagement_potential}/100
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Engagement
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="text-sm font-medium">
                        {analysis.kpi_metrics.message_clarity}/100
                      </p>
                      <p className="text-muted-foreground text-xs">Clarity</p>
                    </div>
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="text-sm font-medium">
                        {analysis.kpi_metrics.conversion_potential}/100
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Conversion
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded p-2 text-center">
                      <p className="text-sm font-medium">
                        {analysis.kpi_metrics.brand_consistency}/100
                      </p>
                      <p className="text-muted-foreground text-xs">Brand</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* KPI Comparison Chart
      <Card>
        <CardHeader>
          <CardTitle>KPI Comparison</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <PerformanceLineChart
            data={comparisonData}
            lines={chartLines}
            height={350}
            className="w-full"
          />
        </CardContent>
      </Card> */}

      {/* Detailed Metric Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(analyses[0].kpi_metrics).map(([metric, _]) => {
              const maxScore = 100; // All metrics now use 0-100 scale

              // Find the best performing analysis for this metric
              const bestAnalysis = analyses.reduce((best, current) =>
                current.kpi_metrics[
                  metric as keyof typeof current.kpi_metrics
                ] > best.kpi_metrics[metric as keyof typeof best.kpi_metrics]
                  ? current
                  : best
              );

              const bestScore =
                bestAnalysis.kpi_metrics[
                  metric as keyof typeof bestAnalysis.kpi_metrics
                ];
              const bestIndex = analyses.findIndex(
                (a) => a.analysis_id === bestAnalysis.analysis_id
              );

              return (
                <div key={metric} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">
                      {metric.replace(/_/g, " ")}
                    </span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground text-sm">
                        Best: {getMediaDisplayName(bestAnalysis, bestIndex)} (
                        {(bestScore as number | undefined)?.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  <div
                    className={`grid gap-3 ${
                      analyses.length <= 2
                        ? "grid-cols-2"
                        : analyses.length === 3
                          ? "grid-cols-3"
                          : "grid-cols-2 lg:grid-cols-4"
                    }`}
                  >
                    {analyses.map((analysis) => {
                      const score =
                        analysis.kpi_metrics[
                          metric as keyof typeof analysis.kpi_metrics
                        ];
                      const isWinner =
                        analysis.analysis_id === bestAnalysis.analysis_id;
                      const personaName = data.participated_personas.find(
                        (a) => a._id === analysis.persona_id
                      )?.name;
                      const fileName = analysis.metadata?.file_name;

                      return (
                        <div key={analysis.analysis_id} className="space-y-1">
                          <div className="text-secondary-foreground flex justify-between">
                            <span className="truncate text-sm">
                              {fileName} v/s {personaName}
                            </span>
                            <span className="text-sm font-medium">
                              {(score as number | undefined)?.toFixed(1)}/
                              {maxScore}
                            </span>
                          </div>
                          <Progress
                            value={
                              (((score as number | undefined) || 0) /
                                maxScore) *
                              100
                            }
                            className={cn("h-2", isWinner && "bg-green-100")}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Strengths vs Weaknesses */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.comparison_analysis?.strengths_weaknesses?.map((item) => {
          const analysis = analyses.find(
            (a) => a.analysis_id === item.analysis_id
          );
          const fileName = analysis?.metadata?.file_name;
          const personaName = data.participated_personas.find(
            (a) => a._id === analysis?.persona_id
          )?.name;

          return (
            <Card key={item.analysis_id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {fileName} v/s {personaName} - Strengths & Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold text-green-700">
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {item.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-green-600"
                      >
                        <span className="mt-1 text-green-500">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-red-700">
                    Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {item.weaknesses.map((weakness, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-red-600"
                      >
                        <span className="mt-1 text-red-500">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
