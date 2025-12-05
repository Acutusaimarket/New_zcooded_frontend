import React from "react";

import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { ABTestHistoryItem } from "../../types";
import type { ProductFitAnalysis } from "@/features/ABTESTING/types";

interface ABTestResultsProps {
  test: ABTestHistoryItem;
  onRestart?: () => void;
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const SemiCircleGauge = ({
  percentage,
  accentColor,
}: {
  percentage: number;
  accentColor: string;
}) => {
  const normalized = Math.max(0, Math.min(100, Math.round(percentage)));
  const radius = 50;
  const pathLength = Math.PI * radius;
  const dashOffset = pathLength - (normalized / 100) * pathLength;

  return (
    <svg viewBox="0 0 120 70" className="h-full w-full">
      <path
        d="M10 60 A50 50 0 0 1 110 60"
        stroke="rgba(148, 163, 184, 0.35)"
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M10 60 A50 50 0 0 1 110 60"
        stroke={accentColor}
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${pathLength} ${pathLength}`}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};

const getScoreVisuals = (value: number) => {
  if (value <= 30) {
    return { colorHex: "#dc2626", textClass: "text-red-600" };
  }
  if (value <= 75) {
    return { colorHex: "#f97316", textClass: "text-orange-500" };
  }
  return { colorHex: "#16a34a", textClass: "text-emerald-600" };
};

// KPI metrics to display
const KPI_METRICS = [
  { key: "compatibility_score", label: "Compatibility Score" },
  { key: "conversion_probability", label: "Conversion Probability" },
  { key: "predicted_purchase_rate", label: "Predicted Purchase Rate" },
  { key: "estimated_user_satisfaction", label: "Estimated User Satisfaction" },
  { key: "predicted_return_probability", label: "Predicted Return Probability" },
  { key: "long_term_retention_score", label: "Long Term Retention Score" },
  { key: "price_fit_score", label: "Price Fit Score" },
  { key: "engagement_potential", label: "Engagement Potential" },
  { key: "usability_score", label: "Usability Score" },
  { key: "feature_relevance", label: "Feature Relevance" },
  { key: "emotional_appeal_score", label: "Emotional Appeal Score" },
  { key: "social_influence_score", label: "Social Influence Score" },
] as const;

interface VariantKPICardProps {
  variant: ProductFitAnalysis;
  kpiKey: string;
  kpiLabel: string;
}

const VariantKPICard: React.FC<VariantKPICardProps> = ({
  variant,
  kpiKey,
  kpiLabel,
}) => {
  // Get the value from the variant for numeric KPIs
  const rawValue = (variant as unknown as Record<string, unknown>)[kpiKey] as
    | number
    | undefined;

  // For numeric values, convert 0-1 scale to percentage
  const percentage =
    rawValue !== undefined
      ? rawValue <= 1 && rawValue >= 0
        ? Math.max(0, Math.min(100, Math.round(rawValue * 100)))
        : Math.max(0, Math.min(100, Math.round(rawValue)))
      : 0;
  const visuals = getScoreVisuals(percentage);

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center space-y-3 px-3 py-4 text-center">
        <div className="relative flex h-20 w-24 items-center justify-center">
          <SemiCircleGauge
            percentage={percentage}
            accentColor={visuals.colorHex}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className={`text-2xl font-bold ${visuals.textClass}`}>
              {percentage}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold">{variant.variant_name}</p>
          <p className="text-muted-foreground text-xs">{kpiLabel}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecommendationCardProps {
  variant: ProductFitAnalysis;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  variant,
}) => {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">{variant.variant_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        {variant.strengths && variant.strengths.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs uppercase">
              Strengths
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {variant.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {variant.weaknesses && variant.weaknesses.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs uppercase">
              Weaknesses
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {variant.weaknesses.map((weakness, idx) => (
                <li key={idx}>{weakness}</li>
              ))}
            </ul>
          </div>
        )}

        {variant.reasoning && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs uppercase">
              Reasoning
            </p>
            <p>{variant.reasoning}</p>
          </div>
        )}

        {variant.improvements && variant.improvements.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs uppercase">
              Improvements
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {variant.improvements.map((improvement, idx) => (
                <li key={idx}>{improvement}</li>
              ))}
            </ul>
          </div>
        )}

        {variant.key_concerns && variant.key_concerns.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-1 text-xs uppercase">
              Key Concerns
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {variant.key_concerns.map((concern, idx) => (
                <li key={idx}>{concern}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ABTestResults: React.FC<ABTestResultsProps> = ({
  test,
  onRestart,
}) => {
  const { product_fit_analysis } = test;

  if (!product_fit_analysis || product_fit_analysis.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="text-destructive">
              <strong>Error:</strong> Product fit analysis data is missing.
              Please try running the test again.
            </div>
          </CardContent>
        </Card>
        {onRestart && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={onRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Use variants as-is (no sorting needed since we removed winning variant emphasis)
  const sortedVariants = product_fit_analysis;

  const handleDownloadReport = async () => {
    try {
      const { generateABTestPDF } = await import(
        "../../utils/generateABTestPDF"
      );
      generateABTestPDF(test);
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted-foreground text-sm tracking-wide uppercase">
            AB Testing
          </p>
          <h2 className="text-2xl font-bold">KPI & Recommendations Summary</h2>
          <p className="text-muted-foreground text-sm">
            Test created on {formatDateTime(test.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onRestart && (
            <Button variant="outline" size="sm" onClick={onRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          )}
          <Button size="sm" onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kpi" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kpi">KPI</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="kpi" className="space-y-4">
          {KPI_METRICS.map((kpi) => (
            <div key={kpi.key} className="space-y-3">
              <h3 className="text-lg font-semibold">{kpi.label}</h3>
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
                {sortedVariants.map((variant) => (
                  <VariantKPICard
                    key={`${variant.product_id?.id}-${kpi.key}`}
                    variant={variant}
                    kpiKey={kpi.key}
                    kpiLabel={kpi.label}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <section className="space-y-3">
            {/* <div>
              <p className="text-sm font-semibold">All Variants</p>
              <p className="text-muted-foreground text-sm">
                Detailed recommendations for all tested variants.
              </p>
            </div> */}
            <div className="space-y-4">
              {sortedVariants.map((variant, index) => (
                <RecommendationCard
                  key={`${variant.product_id?.id}-${index}`}
                  variant={variant}
                />
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

