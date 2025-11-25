import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { RISK_LEVEL_COLORS } from "../../constants/chart-colors";
import type { MediaSimulationData } from "../../types/media-simulation.types";

interface StatusIndicatorsProps {
  data: MediaSimulationData;
  className?: string;
}

export const StatusIndicators = ({
  data,
  className,
}: StatusIndicatorsProps) => {
  const riskFactors = data.comparison_analysis?.risk_factors || [];
  const executionPriorities = data.media_recommendations?.execution_priorities;
  const qualityMetrics = data.media_recommendations?.quality_metrics;

  // Calculate overall risk level
  const highRiskCount = riskFactors.filter(
    (risk) => risk.risk_level === "High"
  ).length;
  const totalRisks = riskFactors.length;
  const overallRiskLevel =
    highRiskCount > 0
      ? "High"
      : riskFactors.some((risk) => risk.risk_level === "Medium")
        ? "Medium"
        : "Low";

  // Calculate readiness status
  const immediateUseCount = executionPriorities?.immediate_use?.length || 0;
  const needsModificationCount =
    executionPriorities?.needs_modification?.length || 0;
  const avoidUsageCount = executionPriorities?.avoid_usage?.length || 0;

  const getReadinessStatus = () => {
    if (immediateUseCount > 0)
      return {
        status: "Ready",
        variant: "default" as const,
        icon: CheckCircle,
      };
    if (needsModificationCount > 0)
      return {
        status: "Needs Work",
        variant: "secondary" as const,
        icon: Clock,
      };
    return {
      status: "Not Ready",
      variant: "destructive" as const,
      icon: XCircle,
    };
  };

  const readinessStatus = getReadinessStatus();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Risk Level */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: RISK_LEVEL_COLORS[overallRiskLevel] }}
              />
              <div>
                <p className="font-semibold">{overallRiskLevel} Risk</p>
                <p className="text-muted-foreground text-xs">
                  {highRiskCount}/{totalRisks} high-risk items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Readiness Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Campaign Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <readinessStatus.icon className="h-4 w-4" />
              <div>
                <p className="font-semibold">{readinessStatus.status}</p>
                <p className="text-muted-foreground text-xs">
                  {immediateUseCount} ready, {needsModificationCount} need work
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Analysis Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold">
                  {qualityMetrics?.recommendation_confidence
                    ? (qualityMetrics.recommendation_confidence * 100).toFixed(
                        0
                      ) + "%"
                    : "N/A"}
                </p>
                <p className="text-muted-foreground text-xs">
                  Confidence level
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status Alerts */}
      <div className="space-y-3">
        {/* High Risk Alert */}
        {overallRiskLevel === "High" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>High Risk Detected:</strong> {highRiskCount} media file(s)
              have high-risk factors. Review before campaign launch.
            </AlertDescription>
          </Alert>
        )}

        {/* No Ready Media Alert */}
        {immediateUseCount === 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>No Media Ready:</strong> All media files require
              modifications before use. Check the recommendations tab for
              guidance.
            </AlertDescription>
          </Alert>
        )}

        {/* Low Quality Alert */}
        {qualityMetrics && qualityMetrics.recommendation_confidence < 0.6 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Low Confidence:</strong> Analysis confidence is below 60%.
              Consider additional data or manual review.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Execution Summary */}
      {executionPriorities && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Execution Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Ready to Use</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {immediateUseCount}
                </p>
                <p className="text-muted-foreground text-xs">
                  Can be used immediately
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Needs Modification</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {needsModificationCount}
                </p>
                <p className="text-muted-foreground text-xs">
                  Require improvements
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Avoid Usage</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {avoidUsageCount}
                </p>
                <p className="text-muted-foreground text-xs">Not recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
