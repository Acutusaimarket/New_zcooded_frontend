import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  Shield,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { MediaSimulationData } from "../../types/media-simulation.types";
import { replaceUUIDs } from "../../utils/data-formatters";

interface RecommendationsPanelProps {
  data: MediaSimulationData;
  className?: string;
}

export const RecommendationsPanel = ({
  data,
  className,
}: RecommendationsPanelProps) => {
  const recommendations = data.media_recommendations;
  const executionPriorities = recommendations?.execution_priorities;
  const strategicRecs = recommendations?.strategic_recommendations;
  const qualityMetrics = recommendations?.quality_metrics;

  if (!recommendations) {
    return (
      <div className={cn("flex h-64 items-center justify-center", className)}>
        <p className="text-muted-foreground">No recommendations available</p>
      </div>
    );
  }

  const getExecutionStatusIcon = (category: string) => {
    switch (category) {
      case "immediate_use":
        return CheckCircle;
      case "needs_modification":
        return Clock;
      case "avoid_usage":
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  const getExecutionStatusColor = (category: string) => {
    switch (category) {
      case "immediate_use":
        return "text-green-600";
      case "needs_modification":
        return "text-yellow-600";
      case "avoid_usage":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Strategic Recommendations</h2>
        {qualityMetrics && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {(qualityMetrics.recommendation_confidence * 100).toFixed(0)}%
              Confidence
            </Badge>
            <Badge variant="secondary">
              Version {recommendations.recommendation_version}
            </Badge>
          </div>
        )}
      </div>

      {/* Executive Summary */}
      {data.comparison_analysis?.final_recommendation && (
        <Alert className="border-primary/20 bg-primary/5">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Executive Summary:</strong>
            <div className="prose prose-sm text-muted-foreground bg-muted prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-muted-foreground prose-blockquote:text-muted-foreground max-w-none rounded-md">
              <ReactMarkdown>
                {replaceUUIDs(
                  data.comparison_analysis.final_recommendation.rationale,
                  data
                )}
              </ReactMarkdown>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Execution Priorities Matrix */}
      {executionPriorities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Execution Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(executionPriorities).map(([category, items]) => {
                const Icon = getExecutionStatusIcon(category);
                const colorClass = getExecutionStatusColor(category);
                const label = category
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                  <Card key={category} className="text-center">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={cn("h-8 w-8", colorClass)} />
                        <h3 className="font-semibold">{label}</h3>
                        <p className="text-2xl font-bold">
                          {Array.isArray(items) ? items.length : 0}
                        </p>
                        {Array.isArray(items) && items.length > 0 && (
                          <div className="w-full space-y-1">
                            {items.map((item, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {item.substring(0, 12)}...
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Metrics */}
      {qualityMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Effectiveness Score
                  </span>
                  <span className="text-sm font-medium">
                    {qualityMetrics.average_effectiveness_score.toFixed(1)}
                  </span>
                </div>
                <Progress
                  value={qualityMetrics.average_effectiveness_score}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Confidence
                  </span>
                  <span className="text-sm font-medium">
                    {(qualityMetrics.recommendation_confidence * 100).toFixed(
                      0
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={qualityMetrics.recommendation_confidence * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Coverage
                  </span>
                  <span className="text-sm font-medium">
                    {(qualityMetrics.coverage_score * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={qualityMetrics.coverage_score * 100}
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Alignment
                  </span>
                  <span className="text-sm font-medium">
                    {(qualityMetrics.alignment_score * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={qualityMetrics.alignment_score * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strategic Recommendations */}
      {strategicRecs && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Campaign Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Campaign Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {strategicRecs.campaign_focus}
              </p>
            </CardContent>
          </Card>

          {/* Messaging Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Messaging Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {strategicRecs?.messaging_themes?.map((theme, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{theme}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Optimization & Risk Mitigation */}
      {strategicRecs && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Content Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strategicRecs?.content_optimization?.map(
                  (optimization, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground flex items-start gap-2 text-sm"
                    >
                      <span className="mt-1 text-blue-500">•</span>
                      {optimization}
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Mitigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strategicRecs?.risk_mitigation?.map((mitigation, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-start gap-2 text-sm"
                  >
                    <span className="mt-1 text-red-500">•</span>
                    {mitigation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Target Audience Priorities */}
      {strategicRecs && (
        <Card>
          <CardHeader>
            <CardTitle>Target Audience Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {strategicRecs?.target_audience_priorities?.map(
                (priority, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 rounded-lg p-4 text-center"
                  >
                    <div className="text-primary mb-1 text-2xl font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm">{priority}</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary Recommendations */}
      {recommendations.primary_recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Primary Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.primary_recommendations.map((rec, index) => {
                const analysis = data.individual_analysis.find(
                  (analysis) => analysis.analysis_id === rec.analysis_id
                );
                const personaName = data.participated_personas.find(
                  (persona) => persona._id === analysis?.persona_id
                )?.name;

                return (
                  <div key={index} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">
                        {personaName} v/s {analysis?.metadata.file_name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          Score: {rec.overall_score.toFixed(1)}
                        </Badge>
                        <Badge variant="outline">
                          {(rec.confidence_score * 100).toFixed(0)}% Confidence
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h5 className="mb-2 text-sm font-medium">
                        Selection Rationale
                      </h5>
                      <ul className="space-y-1">
                        {rec.selection_rationale.map((rationale, idx) => (
                          <li
                            key={idx}
                            className="text-muted-foreground flex items-start gap-2 text-sm"
                          >
                            <span className="text-primary mt-1">•</span>
                            {rationale}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Matrix */}
      {recommendations.performance_matrix && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <h3 className="font-semibold text-green-800">
                  High Performers
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {recommendations?.performance_matrix?.high_performers?.length}
                </p>
                <div className="mt-2 space-y-1">
                  {recommendations?.performance_matrix?.high_performers?.map(
                    (performer, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {performer.substring(0, 8)}...
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                <Clock className="mx-auto mb-2 h-8 w-8 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">
                  Moderate Performers
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    recommendations?.performance_matrix?.moderate_performers
                      .length
                  }
                </p>
                <div className="mt-2 space-y-1">
                  {recommendations?.performance_matrix?.moderate_performers?.map(
                    (performer, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {performer.substring(0, 8)}...
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <XCircle className="mx-auto mb-2 h-8 w-8 text-red-600" />
                <h3 className="font-semibold text-red-800">Underperformers</h3>
                <p className="text-2xl font-bold text-red-600">
                  {recommendations?.performance_matrix?.underperformers?.length}
                </p>
                <div className="mt-2 space-y-1">
                  {recommendations?.performance_matrix?.underperformers?.map(
                    (performer, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="text-xs"
                      >
                        {performer.substring(0, 8)}...
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Insights */}
      {recommendations.additional_insights && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendations?.additional_insights?.surprising_findings?.length >
              0 && (
              <div>
                <h4 className="mb-2 font-semibold text-purple-700">
                  Surprising Findings
                </h4>
                <ul className="space-y-1">
                  {recommendations?.additional_insights?.surprising_findings?.map(
                    (finding, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-purple-600"
                      >
                        <span className="mt-1 text-purple-500">•</span>
                        {finding}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {recommendations?.additional_insights?.market_opportunities
              ?.length > 0 && (
              <div>
                <h4 className="mb-2 font-semibold text-green-700">
                  Market Opportunities
                </h4>
                <ul className="space-y-1">
                  {recommendations?.additional_insights?.market_opportunities?.map(
                    (opportunity, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-green-600"
                      >
                        <span className="mt-1 text-green-500">•</span>
                        {opportunity}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {recommendations.additional_insights.competitive_advantages.length >
              0 && (
              <div>
                <h4 className="mb-2 font-semibold text-blue-700">
                  Competitive Advantages
                </h4>
                <ul className="space-y-1">
                  {recommendations.additional_insights.competitive_advantages.map(
                    (advantage, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-blue-600"
                      >
                        <span className="mt-1 text-blue-500">•</span>
                        {advantage}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {recommendations.additional_insights.scalability_factors.length >
              0 && (
              <div>
                <h4 className="mb-2 font-semibold text-orange-700">
                  Scalability Factors
                </h4>
                <ul className="space-y-1">
                  {recommendations.additional_insights.scalability_factors.map(
                    (factor, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-orange-600"
                      >
                        <span className="mt-1 text-orange-500">•</span>
                        {factor}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
            <div>
              <p className="text-primary text-2xl font-bold">
                {recommendations.total_media_analyzed}
              </p>
              <p className="text-muted-foreground text-sm">
                Media Files Analyzed
              </p>
            </div>

            <div>
              <p className="text-primary text-2xl font-bold">
                {recommendations?.primary_recommendations?.length}
              </p>
              <p className="text-muted-foreground text-sm">
                Primary Recommendations
              </p>
            </div>

            <div>
              <p className="text-primary text-2xl font-bold">
                {(
                  (qualityMetrics?.recommendation_confidence || 0) * 100
                ).toFixed(0)}
                %
              </p>
              <p className="text-muted-foreground text-sm">
                Overall Confidence
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
