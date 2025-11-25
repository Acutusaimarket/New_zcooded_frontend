import React from "react";

import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Crown,
  DollarSign,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { TooltipWrapper } from "@/components/ui/tooltip";

import type {
  ABTestResult,
  ProductFitAnalysis,
  StatisticalResults,
} from "../types";

interface ABTestResultsProps {
  result: ABTestResult | null;
  onRestart: () => void;
}

interface TestSummaryProps {
  result: ABTestResult;
  onRestart: () => void;
}

interface ProductPerformanceProps {
  analysis: ProductFitAnalysis;
  isWinner: boolean;
}

interface StatisticalResultsProps {
  stats: StatisticalResults;
}

// Test Summary Component
const TestSummary: React.FC<TestSummaryProps> = ({ result, onRestart }) => (
  <Card className="border-none bg-transparent p-0 shadow-none">
    <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
        <BarChart3 className="text-muted-foreground size-4" />
        Test Summary
      </CardTitle>
      <Button onClick={onRestart} variant="outline" className="gap-2">
        <TrendingUp className="h-4 w-4" />
        Start New Test
      </Button>
    </CardHeader>
    <CardContent className="space-y-2.5 px-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Users className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Persona</p>
              <p className="text-muted-foreground text-xs">Target audience</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm font-semibold">
            {/* Medicare Senior */}
          </Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Target className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Sample Size</p>
              <p className="text-muted-foreground text-xs">Test participants</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm font-semibold">
            {result.sample_size.toLocaleString()}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <Trophy className="text-muted-foreground h-5 w-5" />
          <div>
            <p className="text-sm font-medium">Recommended Product</p>
            <p className="text-muted-foreground text-xs">
              Best performing variant
            </p>
          </div>
        </div>
        <Badge variant="success" className="text-sm font-semibold">
          {result.product_fit_analysis.find(
            (p) => p.product_id.id === result.recommended_variant.id
          )?.variant_name || "Unknown Product"}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Product Performance Component
const ProductPerformance: React.FC<ProductPerformanceProps> = ({
  analysis,
  isWinner,
}) => (
  <Card
    className={
      isWinner
        ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg ring-2 ring-yellow-400"
        : "transition-shadow hover:shadow-md"
    }
  >
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isWinner && <Crown className="h-5 w-5 text-yellow-500" />}
          <CardTitle className={`text-lg ${isWinner ? "text-yellow-800" : ""}`}>
            {analysis.variant_name}
          </CardTitle>
        </div>
        {isWinner && (
          <Badge
            variant="success"
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            <Trophy className="mr-1 h-3 w-3" />
            Winner
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-purple-500" />
            <p className="text-muted-foreground text-sm">Compatibility Score</p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.compatibility_score * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.compatibility_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-muted-foreground text-sm">
              Conversion Probability
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.conversion_probability * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.conversion_probability * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-orange-500" />
            <p className="text-muted-foreground text-sm">Price Fit</p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.price_fit_score * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.price_fit_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <p className="text-muted-foreground text-sm">Feature Relevance</p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.feature_relevance * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.feature_relevance * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Additional Fit Metrics per new type definition */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-indigo-500" />
            <p className="text-muted-foreground text-sm">
              Engagement Potential
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.engagement_potential * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.engagement_potential * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-teal-500" />
            <p className="text-muted-foreground text-sm">Usability Score</p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.usability_score * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.usability_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-rose-500" />
            <p className="text-muted-foreground text-sm">Emotional Appeal</p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.emotional_appeal_score * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.emotional_appeal_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-600" />
            <p className="text-muted-foreground text-sm">Social Influence</p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.social_influence_score * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.social_influence_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <p className="text-muted-foreground text-sm">
              Predicted Purchase Rate
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.predicted_purchase_rate * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.predicted_purchase_rate * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-sky-600" />
            <p className="text-muted-foreground text-sm">
              Estimated Satisfaction
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.estimated_user_satisfaction * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.estimated_user_satisfaction * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-muted-foreground text-sm">
              Predicted Return Probability
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.predicted_return_probability * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.predicted_return_probability * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-lime-600" />
            <p className="text-muted-foreground text-sm">Long-term Retention</p>
          </div>
          <div className="flex items-center space-x-2">
            <Progress
              value={analysis.long_term_retention_score * 100}
              className="flex-1"
            />
            <span className="text-sm font-medium">
              {(analysis.long_term_retention_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="text-muted-foreground text-sm">
          Expected Usage Frequency
        </div>
        <Badge variant="outline" className="text-xs font-semibold">
          {analysis.expected_usage_frequency}
        </Badge>
      </div>

      <div className="space-y-3">
        <Collapsible>
          <TooltipWrapper
            content="Click to view key strengths"
            triggerProps={{
              asChild: true,
            }}
          >
            <CollapsibleTrigger className="mb-2 flex w-full cursor-pointer items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-700">
                  Key Strengths
                </p>
              </div>
            </CollapsibleTrigger>
          </TooltipWrapper>
          <ul className="space-y-1 text-sm">
            {(analysis.strengths ?? [])
              .slice(0, 2)
              .map((strength: string, index: number) => (
                <li
                  key={index}
                  className="text-muted-foreground flex items-start gap-2"
                >
                  <span className="mt-1 text-green-500">•</span>
                  <span>{strength}</span>
                </li>
              ))}
          </ul>
          {(analysis.strengths ?? []).length > 2 && (
            <CollapsibleContent>
              <ul className="mt-1 space-y-1 text-sm">
                {(analysis.strengths ?? [])
                  .slice(2)
                  .map((strength: string, index: number) => (
                    <li
                      key={index + 2}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="mt-1 text-green-500">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
              </ul>
            </CollapsibleContent>
          )}
        </Collapsible>

        <Collapsible>
          <TooltipWrapper
            content="Click to view key concerns"
            triggerProps={{
              asChild: true,
            }}
          >
            <CollapsibleTrigger className="mb-2 flex w-full cursor-pointer items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm font-medium text-red-700">Key Concerns</p>
              </div>
            </CollapsibleTrigger>
          </TooltipWrapper>
          <ul className="space-y-1 text-sm">
            {(
              (analysis?.key_concerns && analysis?.key_concerns?.length > 0
                ? analysis.key_concerns
                : analysis?.weaknesses) ?? []
            )
              .slice(0, 2)
              .map((weakness: string, index: number) => (
                <li
                  key={index}
                  className="text-muted-foreground flex items-start gap-2"
                >
                  <span className="mt-1 text-red-500">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
          </ul>
          {(
            (analysis?.key_concerns && analysis?.key_concerns?.length > 0
              ? analysis.key_concerns
              : analysis?.weaknesses) ?? []
          ).length > 2 && (
            <CollapsibleContent>
              <ul className="mt-1 space-y-1 text-sm">
                {(
                  ((analysis.key_concerns ?? []).length > 0
                    ? analysis.key_concerns
                    : analysis.weaknesses) ?? []
                )
                  .slice(2)
                  .map((weakness: string, index: number) => (
                    <li
                      key={index + 2}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="mt-1 text-red-500">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
              </ul>
            </CollapsibleContent>
          )}
        </Collapsible>

        {analysis.improvements && analysis.improvements.length > 0 && (
          <Collapsible>
            <TooltipWrapper
              content="Click to view recommended improvements"
              triggerProps={{
                asChild: true,
              }}
            >
              <CollapsibleTrigger className="mb-2 flex w-full cursor-pointer items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <p className="text-sm font-medium text-amber-700">
                    Improvements
                  </p>
                </div>
              </CollapsibleTrigger>
            </TooltipWrapper>
            <ul className="space-y-1 text-sm">
              {analysis.improvements
                .slice(0, 3)
                .map((item: string, index: number) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-1 text-amber-600">•</span>
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
            {analysis.improvements.length > 3 && (
              <CollapsibleContent>
                <ul className="mt-1 space-y-1 text-sm">
                  {analysis.improvements
                    .slice(3)
                    .map((item: string, index: number) => (
                      <li
                        key={index + 3}
                        className="text-muted-foreground flex items-start gap-2"
                      >
                        <span className="mt-1 text-amber-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </CollapsibleContent>
            )}
          </Collapsible>
        )}

        {/* {(analysis.summary || analysis.reasoning) && (
          <div className="space-y-1 rounded-md border p-3">
            {analysis.summary && <p className="text-sm font-medium">Summary</p>}
            {analysis.summary && (
              <p className="text-muted-foreground text-sm">
                {analysis.summary}
              </p>
            )}
            {analysis.reasoning && (
              <p className="mt-2 text-sm font-medium">Reasoning</p>
            )}
            {analysis.reasoning && (
              <p className="text-muted-foreground text-sm">
                {analysis.reasoning}
              </p>
            )}
          </div>
        )} */}
      </div>
    </CardContent>
  </Card>
);

// Statistical Results Component
const StatisticalResults: React.FC<StatisticalResultsProps> = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-slate-600" />
        Statistical Analysis
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Control Rate</p>
              <p className="text-muted-foreground text-xs">Base conversion</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm font-semibold">
            {(stats.control_conversion_rate * 100).toFixed(1)}%
          </Badge>
        </Card>

        <Card className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Target className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Effect Size</p>
              <p className="text-muted-foreground text-xs">
                Statistical impact
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm font-semibold">
            {stats.effect_size.toFixed(3)}
          </Badge>
        </Card>

        <Card className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {stats.is_significant ? (
              <CheckCircle className="text-muted-foreground h-5 w-5" />
            ) : (
              <AlertCircle className="text-muted-foreground h-5 w-5" />
            )}
            <div>
              <p className="text-sm font-medium">Significance</p>
              <p className="text-muted-foreground text-xs">
                Statistical validity
              </p>
            </div>
          </div>
          <Badge variant={stats.is_significant ? "success" : "warning"}>
            {stats.is_significant ? "Significant" : "Not Significant"}
          </Badge>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 border-slate-200 md:grid-cols-2">
        <Card className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">P-Value</p>
              <p className="text-muted-foreground text-xs">Probability score</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm font-semibold">
            {stats.p_value !== null ? stats.p_value.toFixed(4) : "N/A"}
          </Badge>
        </Card>

        <Card className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Target className="text-muted-foreground h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Confidence Interval</p>
              <p className="text-muted-foreground text-xs">Range estimate</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm font-semibold">
            {stats.confidence_interval &&
            Array.isArray(stats.confidence_interval)
              ? `[${stats.confidence_interval[0].toFixed(3)}, ${stats.confidence_interval[1].toFixed(3)}]`
              : "N/A"}
          </Badge>
        </Card>
      </div>
    </CardContent>
  </Card>
);

export const ABTestResults: React.FC<ABTestResultsProps> = ({
  result,
  onRestart,
}) => {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-4">No results available</div>
        <Button onClick={onRestart}>Start New Test</Button>
      </div>
    );
  }

  // Sort products with winner first, then by compatibility score
  const sortedAnalysis = [...result.product_fit_analysis].sort((a, b) => {
    const aIsWinner =
      a.product_id.id === result.statistical_results.winning_variant;
    const bIsWinner =
      b.product_id.id === result.statistical_results.winning_variant;

    if (aIsWinner && !bIsWinner) return -1;
    if (!aIsWinner && bIsWinner) return 1;

    return b.compatibility_score - a.compatibility_score;
  });

  return (
    <div className="space-y-6">
      <TestSummary result={result} onRestart={onRestart} />
      <div>
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold">Product Performance</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedAnalysis.map((analysis: ProductFitAnalysis) => (
            <ProductPerformance
              key={analysis.product_id.id}
              analysis={analysis}
              isWinner={
                analysis.product_id.id ===
                result.statistical_results.winning_variant
              }
            />
          ))}
        </div>
      </div>

      <StatisticalResults stats={result.statistical_results} />
    </div>
  );
};
