import React, { useState } from "react";

import {
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Heart,
  Info,
  MousePointer,
  Percent,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TooltipWrapper } from "@/components/ui/tooltip";
import type { ProductFitAnalysis } from "@/features/ABTESTING/types";
import { cn } from "@/lib/utils";

import type { ABTestHistoryItem } from "../../types";

interface VariantComparisonGraphProps {
  test: ABTestHistoryItem;
}

interface MetricData {
  name: string;
  value: number;
  maxValue: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

export const VariantComparisonGraph: React.FC<VariantComparisonGraphProps> = ({
  test,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const formatInt = (value?: number) =>
    typeof value === "number" ? value.toLocaleString() : "-";
  const formatPct = (value?: number) =>
    typeof value === "number" ? `${Math.round(value)}%` : "-";
  // Helper function to get variant display name
  const getVariantDisplayName = (variantId: string, index?: number) => {
    if (!variantId) return "Unknown";
    if (variantId.toLowerCase() === "control") return "Control";

    if (test?.product_fit_analysis) {
      const analysis = test.product_fit_analysis.find(
        (item) =>
          item.product_id?.id === variantId ||
          item.variant_name?.toLowerCase().includes(variantId.toLowerCase())
      );
      if (analysis?.variant_name) {
        return analysis.variant_name;
      }
    }

    if (typeof index === "number") {
      return `Variant ${String.fromCharCode(65 + index)}`;
    }

    return `Variant ${variantId}`;
  };

  // Get product fit analysis data
  const getVariantMetrics = (analysis: ProductFitAnalysis, index: number) => {
    const variantName = getVariantDisplayName(
      analysis.product_id?.id || `variant-${index}`,
      index
    );

    return {
      name: variantName,
      metrics: [
        {
          name: "Compatibility",
          value: Math.round((analysis.compatibility_score || 0) * 100),
          maxValue: 100,
          icon: Star,
          color: "text-blue-600",
          description: "Overall compatibility score with target persona",
        },
        {
          name: "Conversion",
          value: Math.round((analysis.conversion_probability || 0) * 100),
          maxValue: 100,
          icon: TrendingUp,
          color: "text-green-600",
          description: "Probability of conversion for this variant",
        },
        {
          name: "Price Fit",
          value: Math.round((analysis.price_fit_score || 0) * 100),
          maxValue: 100,
          icon: DollarSign,
          color: "text-green-600",
          description: "How well the price matches persona expectations",
        },
        {
          name: "Engagement",
          value: Math.round((analysis.engagement_potential || 0) * 100),
          maxValue: 100,
          icon: Heart,
          color: "text-pink-600",
          description: "Potential for user engagement and interaction",
        },
        {
          name: "Usability",
          value: Math.round((analysis.usability_score || 0) * 100),
          maxValue: 100,
          icon: MousePointer,
          color: "text-blue-600",
          description: "Ease of use and user experience quality",
        },
        {
          name: "Features",
          value: Math.round((analysis.feature_relevance || 0) * 100),
          maxValue: 100,
          icon: Star,
          color: "text-purple-600",
          description: "Relevance and quality of product features",
        },
      ] as MetricData[],
    };
  };

  // Get all variants data
  const variantsData =
    test.product_fit_analysis?.map((analysis, index) =>
      getVariantMetrics(analysis, index)
    ) || [];

  // Get winning variant info
  const winningVariant = test.statistical_results.winning_variant;
  const isSignificant = test.statistical_results.is_significant;

  // Get conversion rate for each variant
  const getConversionRate = (variantIndex: number) => {
    // Get conversion probability from product fit analysis
    const conversionProbability =
      test.product_fit_analysis?.[variantIndex]?.conversion_probability;
    if (conversionProbability !== undefined) {
      return Math.round(conversionProbability * 100);
    }

    // Fallback to control conversion rate if no conversion probability found
    return Math.round(test.statistical_results.control_conversion_rate * 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle>Variant Comparison Analysis</CardTitle>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-md p-2 transition-colors"
          >
            <span className="text-sm font-medium">
              {isCollapsed ? "Expand" : "Collapse"}
            </span>
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-muted-foreground text-sm">
          Comprehensive comparison of product variants across key metrics
        </p>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="space-y-6">
          {/* Overall Performance Summary */}
          <div className="space-y-4">
            {/* <div className="flex items-center justify-center gap-2">
             <h3 className="text-lg font-semibold">
               Overall Performance Summary
             </h3>
             <TooltipWrapper
               content={
                 <div className="max-w-xs">
                   <p className="font-medium">Conversion Performance</p>
                   <p className="text-xs opacity-90">
                     Conversion rates for each variant based on A/B test results
                   </p>
                 </div>
               }
             >
               <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-help transition-colors" />
             </TooltipWrapper>
           </div> */}

            <div className="flex justify-center">
              <div className="grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
                {variantsData.map((variant, index) => {
                  const conversionRate = getConversionRate(index);
                  const isWinning =
                    winningVariant &&
                    (variant.name
                      .toLowerCase()
                      .includes(winningVariant.toLowerCase()) ||
                      variant.name === getVariantDisplayName(winningVariant));

                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative rounded-lg border p-4 transition-all duration-200",
                        isWinning && isSignificant
                          ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                          : "border-border bg-card"
                      )}
                    >
                      {isWinning && isSignificant && (
                        <div className="absolute -top-2 -right-2">
                          <Award className="h-6 w-6 text-yellow-500" />
                        </div>
                      )}

                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {variant.name}
                        </h3>
                        <Badge
                          variant={
                            isWinning && isSignificant ? "default" : "secondary"
                          }
                          className={cn(
                            isWinning &&
                              isSignificant &&
                              "bg-yellow-500 hover:bg-yellow-600"
                          )}
                        >
                          {conversionRate}%
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Conversion Rate
                          </span>
                          <span className="font-medium">{conversionRate}%</span>
                        </div>
                        <Progress value={conversionRate} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Variant Cohort Metrics (moved up) */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Info className="h-5 w-5" />
              Variant Cohort Metrics
            </h3>

            <div className="grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
              {test.product_fit_analysis?.map((analysis, index) => {
                const name = getVariantDisplayName(
                  analysis.product_id?.id || `variant-${index}`,
                  index
                );
                const pctValue = (v?: number) =>
                  typeof v === "number"
                    ? Math.max(0, Math.min(100, v * 100))
                    : 0;

                return (
                  <div
                    key={index}
                    className="bg-card/50 rounded-lg border p-4 shadow-sm backdrop-blur-sm"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold">{name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-md border p-2">
                        <div className="text-muted-foreground flex items-center justify-between gap-2">
                          <span>Users completed</span>
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <div className="mt-1 font-medium">
                          {formatInt(analysis.users_completing_purchase)}
                        </div>
                      </div>

                      <div className="rounded-md border p-2">
                        <div className="text-muted-foreground flex items-center justify-between gap-2">
                          <span>Leave immediately</span>
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <div className="mt-1 font-medium">
                          {formatInt(analysis.users_leave_immediately)}
                        </div>
                      </div>

                      <div className="rounded-md border p-2">
                        <div className="text-muted-foreground flex items-center justify-between gap-2">
                          <span>Abandon mid-funnel</span>
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <div className="mt-1 font-medium">
                          {formatInt(analysis.users_abandoning_at_each_stage)}
                        </div>
                      </div>

                      <div className="rounded-md border p-2">
                        <div className="text-muted-foreground flex items-center justify-between gap-2">
                          <span>Total exposed</span>
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <div className="mt-1 font-medium">
                          {formatInt(analysis.total_exposed_users)}
                        </div>
                      </div>

                      <div className="col-span-2 rounded-md border p-3">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <div className="text-muted-foreground flex items-center gap-2">
                            <Percent className="h-3.5 w-3.5" />
                            <span>Percent difference</span>
                          </div>
                          <span className="font-semibold">
                            {formatPct(
                              analysis.percentage_difference_between_variants
                            )}
                          </span>
                        </div>
                        <Progress
                          value={pctValue(
                            analysis.percentage_difference_between_variants
                          )}
                          className="h-2"
                        />
                      </div>

                      <div className="col-span-2 rounded-md border p-3">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <div className="text-muted-foreground flex items-center gap-2">
                            <Percent className="h-3.5 w-3.5" />
                            <span>Magnitude difference</span>
                          </div>
                          <span className="font-semibold">
                            {formatPct(
                              analysis.magnitude_difference_between_variants
                            )}
                          </span>
                        </div>
                        <Progress
                          value={pctValue(
                            analysis.magnitude_difference_between_variants
                          )}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Metrics Comparison */}
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Target className="h-5 w-5" />
              Detailed Metrics Breakdown
            </h3>

            <div className="grid gap-6">
              {variantsData[0]?.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    <h4 className="font-medium">{metric.name}</h4>
                    <TooltipWrapper
                      content={
                        <div className="max-w-xs">
                          <p className="font-medium">{metric.name}</p>
                          <p className="text-xs opacity-90">
                            {metric.description}
                          </p>
                        </div>
                      }
                    >
                      <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-help transition-colors" />
                    </TooltipWrapper>
                  </div>

                  <div className="space-y-3">
                    {variantsData.map((variant, variantIndex) => {
                      const metricValue =
                        variant.metrics[metricIndex]?.value || 0;
                      const isWinning =
                        winningVariant &&
                        (variant.name
                          .toLowerCase()
                          .includes(winningVariant.toLowerCase()) ||
                          variant.name ===
                            getVariantDisplayName(winningVariant));

                      return (
                        <div key={variantIndex} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {variant.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">
                                {metricValue}%
                              </span>
                              {isWinning && isSignificant && (
                                <TrendingUp className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                          <div className="relative">
                            <Progress value={metricValue} className="h-3" />
                            <div
                              className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-transparent to-transparent"
                              style={{
                                background: `linear-gradient(90deg, 
                                ${metric.color.replace("text-", "")} 0%, 
                                ${metric.color.replace("text-", "")} ${metricValue}%, 
                                transparent ${metricValue}%, 
                                transparent 100%)`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights - Removed as requested */}
        </CardContent>
      )}
    </Card>
  );
};
