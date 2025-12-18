import React from "react";

import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type {
  MarketFitAnsweredQuestion,
  MarketFitAttachment,
  MarketFitCriticalIssue,
  MarketFitKpiSummary,
  MarketFitProductModification,
  MarketFitSegmentAnalysis,
  MarketFitSegmentRecommendation,
  MarketFitSimulationPayload,
  MarketFitValuePropRewrite,
} from "../types";

interface MarketFitSimulationResultsProps {
  data: MarketFitSimulationPayload;
  onRestart: () => void;
  productName?: string;
}
const titleCase = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const EmphasizedText = ({ text }: { text: string }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span key={`${part}-${index}`} className="font-semibold">
            {part}
          </span>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

const ListSection = ({ title, items }: { title: string; items: string[] }) => {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
        {title}
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-sm">
        {items.map((item, idx) => (
          <li key={idx} className="text-foreground">
            <EmphasizedText text={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const RecommendationBlock = ({
  recommendation,
}: {
  recommendation: MarketFitSegmentRecommendation;
}) => (
  <Card className="shadow-sm transition-shadow hover:shadow-md">
    <CardHeader className="pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{recommendation.category}</Badge>
        <Badge
          variant={
            recommendation.priority === "High"
              ? "destructive"
              : recommendation.priority === "Medium"
                ? "secondary"
                : "outline"
          }
        >
          {recommendation.priority} priority
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-3 text-sm leading-relaxed">
      <p className="text-foreground font-medium">
        <EmphasizedText text={recommendation.recommendation} />
      </p>
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
          Rationale
        </p>
        <p className="text-foreground">
          <EmphasizedText text={recommendation.rationale} />
        </p>
      </div>
    </CardContent>
  </Card>
);

const CriticalIssueCard = ({ issue }: { issue: MarketFitCriticalIssue }) => (
  <Card className="shadow-sm transition-shadow hover:shadow-md">
    <CardHeader className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{issue.category}</Badge>
        <Badge
          variant={
            issue.severity === "Critical"
              ? "destructive"
              : issue.severity === "High"
                ? "secondary"
                : "outline"
          }
        >
          {issue.severity}
        </Badge>
        {issue.quick_win ? <Badge variant="default">Quick win</Badge> : null}
      </div>
      <CardTitle className="text-xl font-semibold">{issue.title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-sm leading-relaxed">
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Description
        </p>
        <p className="text-foreground">{issue.description}</p>
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Affected segments
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {issue.affected_segments.map((segment) => (
            <Badge key={segment} variant="outline">
              {segment}
            </Badge>
          ))}
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Business impact
        </p>
        <div className="text-foreground space-y-1">
          {issue.business_impact.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
      <div className="bg-primary/5 rounded-lg p-3">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Recommendations
        </p>
        <div className="text-foreground space-y-1">
          {issue.recommendations.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProductModificationCard = ({
  item,
}: {
  item: MarketFitProductModification;
}) => (
  <Card className="shadow-sm transition-shadow hover:shadow-md">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">
        {item.modification_area}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 text-sm leading-relaxed">
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Current state
        </p>
        <p className="text-foreground">{item.current_state}</p>
      </div>
      <div className="bg-primary/5 rounded-lg p-3">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Recommended state
        </p>
        <p className="text-foreground font-medium">{item.recommended_state}</p>
      </div>
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Justification
        </p>
        <p className="text-foreground">{item.justification}</p>
      </div>
    </CardContent>
  </Card>
);

const ValuePropRewriteCard = ({
  rewrite,
}: {
  rewrite: MarketFitValuePropRewrite;
}) => (
  <Card className="shadow-sm transition-shadow hover:shadow-md">
    <CardHeader className="space-y-3">
      <CardTitle className="text-lg font-semibold">Current Messaging</CardTitle>
      <div className="bg-muted/50 rounded-lg p-3">
        <p className="text-foreground text-sm leading-relaxed">
          {rewrite.current_messaging}
        </p>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {rewrite.recommendation_by_segment.map((segment) => (
        <div
          key={segment.segment_name}
          className="bg-card rounded-lg border p-4 transition-shadow hover:shadow-sm"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-foreground text-sm font-semibold">
              {segment.segment_name} · {segment.primary_hook}
            </h4>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm">
            {segment.key_messages_to_add.map((message, idx) => (
              <li key={idx} className="text-foreground">
                <EmphasizedText text={message} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AttachmentList = ({
  attachments,
}: {
  attachments: MarketFitAttachment[];
}) => {
  if (!attachments?.length) return null;
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle className="text-base">Simulation Artifacts</CardTitle>
      </CardHeader> */}
      {/* <CardContent className="space-y-3 text-sm">
        {attachments.map((file) => (
          <div
            key={file.key}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
          >
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-muted-foreground text-xs">
                {file.content_type}
              </p>
            </div>
            {file.url ? (
              <Button asChild size="sm" variant="outline">
                <a href={file.url} target="_blank" rel="noreferrer">
                  Download
                </a>
              </Button>
            ) : (
              <Badge variant="outline">Uploaded</Badge>
            )}
          </div>
        ))}
      </CardContent> */}
    </Card>
  );
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
        stroke="#e5e7eb"
        strokeWidth={12}
        strokeLinecap="butt"
        fill="none"
      />
      <path
        d="M10 60 A50 50 0 0 1 110 60"
        stroke={accentColor}
        strokeWidth={12}
        strokeLinecap="butt"
        fill="none"
        strokeDasharray={`${pathLength} ${pathLength}`}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};

const kpiDescriptions: Record<string, string> = {
  adoption_rate:
    "Percentage of users who start actively using the product after first exposure.",
  churn_probability:
    "Indicates how likely users are to stop using the product.",
  click_through_rate:
    "Percentage of viewers who click on a link or call-to-action.",
  conversion_rate: "Percentage of users who complete a desired action.",
  customer_acquisition_cost: "Average cost to gain a new customer.",
  interest_level: "Measures how engaged and interested users feel.",
  pmf_index:
    "Indicates how strongly the product satisfies the target market's needs.",
  price_perception: "How users feel about the product's price.",
  problem_solution_fit:
    "Indicates how well the product solves real user problems.",
  purchase_intent: "How likely users are to buy the product.",
  retention_intent:
    "Shows how likely users are to continue using or renewing the product.",
  retention_rate:
    "Shows how likely users are to continue using or renewing the product.",
  satisfaction: "Overall happiness with the experience of product.",
  trial_to_adoption: "Overall happiness with the experience of product.",
  usability: "How easy and intuitive the product feels.",
};

const getScoreVisuals = (value: number) => {
  if (value <= 30) {
    return {
      colorHex: "#dc2626",
      textClass: "text-red-600",
      bgColor: "bg-red-500",
    };
  }
  if (value <= 75) {
    return {
      colorHex: "#f97316",
      textClass: "text-orange-500",
      bgColor: "bg-orange-500",
    };
  }
  return {
    colorHex: "#42bd00",
    textClass: "text-[#42bd00]",
    bgColor: "bg-[#42bd00]",
  };
};

// Semi-circular gauge for Core PMF Metrics
const KpiGaugeCard = ({ kpi }: { kpi: MarketFitKpiSummary }) => {
  const percentage = Math.max(
    0,
    Math.min(100, Math.round((kpi.average_response ?? 0) * 100))
  );
  const visuals = getScoreVisuals(percentage);
  const metricKey = kpi.kpi_metric.toLowerCase();
  const description =
    kpiDescriptions[metricKey] ??
    `Higher values indicate stronger ${kpi.metric_type.toLowerCase()} performance.`;

  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col items-center space-y-4 px-4 py-6 text-center">
        <div className="relative flex h-24 w-28 items-center justify-center">
          <SemiCircleGauge
            percentage={percentage}
            accentColor={visuals.colorHex}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className={`text-3xl font-bold ${visuals.textClass}`}>
              {percentage}%
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-semibold text-gray-900">
            {titleCase(kpi.kpi_metric)}
          </p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Horizontal progress bar for Growth & Conversion Metrics
const KpiProgressBarCard = ({ kpi }: { kpi: MarketFitKpiSummary }) => {
  const percentage = Math.max(
    0,
    Math.min(100, Math.round((kpi.average_response ?? 0) * 100))
  );
  const visuals = getScoreVisuals(percentage);
  const metricKey = kpi.kpi_metric.toLowerCase();
  const description =
    kpiDescriptions[metricKey] ??
    `Higher values indicate stronger ${kpi.metric_type.toLowerCase()} performance.`;

  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="space-y-3 px-4 py-6">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-gray-900">
            {titleCase(kpi.kpi_metric)}
          </p>
          <span className={`text-lg font-bold ${visuals.textClass}`}>
            {percentage}%
          </span>
        </div>
        <div className="space-y-1">
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${visuals.bgColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Circular gauge for Experience & Value Metrics
const CircularGauge = ({
  percentage,
  accentColor,
}: {
  percentage: number;
  accentColor: string;
}) => {
  const normalized = Math.max(0, Math.min(100, Math.round(percentage)));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalized / 100) * circumference;

  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#e5e7eb"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke={accentColor}
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
    </svg>
  );
};

const KpiCircularGaugeCard = ({ kpi }: { kpi: MarketFitKpiSummary }) => {
  const percentage = Math.max(
    0,
    Math.min(100, Math.round((kpi.average_response ?? 0) * 100))
  );
  const visuals = getScoreVisuals(percentage);
  const metricKey = kpi.kpi_metric.toLowerCase();
  const description =
    kpiDescriptions[metricKey] ??
    `Higher values indicate stronger ${kpi.metric_type.toLowerCase()} performance.`;

  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col items-center space-y-4 px-4 py-6 text-center">
        <div className="relative flex items-center justify-center">
          <CircularGauge
            percentage={percentage}
            accentColor={visuals.colorHex}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${visuals.textClass}`}>
              {percentage}%
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-semibold text-gray-900">
            {titleCase(kpi.kpi_metric)}
          </p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Segmented semi-circular gauge for Price Perception
const SegmentedPricePerceptionGauge = ({
  kpi,
}: {
  kpi: MarketFitKpiSummary;
}) => {
  // For price perception, we'll use a simplified segmented display
  // In a real scenario, you'd have separate data for affordable/fair/expensive
  const percentage = Math.max(
    0,
    Math.min(100, Math.round((kpi.average_response ?? 0) * 100))
  );
  const visuals = getScoreVisuals(percentage);

  // Simulated segments - in real app, these would come from the API
  const affordable = Math.round(percentage * 0.55);
  const fair = Math.round(percentage * 0.3);
  const expensive = Math.round(percentage * 0.15);

  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col items-center space-y-4 px-4 py-6 text-center">
        <div className="relative flex h-24 w-28 items-center justify-center">
          <SemiCircleGauge
            percentage={percentage}
            accentColor={visuals.colorHex}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className={`text-3xl font-bold ${visuals.textClass}`}>
              {percentage}%
            </span>
          </div>
        </div>
        <div className="w-full space-y-2">
          <p className="text-base font-semibold text-gray-900">
            Price Perception
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-[#42bd00]" />
                <span className="text-gray-700">
                  {affordable}% feels affordable
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-orange-500" />
                <span className="text-gray-700">{fair}% feels fair</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-red-500" />
                <span className="text-gray-700">
                  {expensive}% feels expensive
                </span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            {kpiDescriptions.price_perception}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const MarketFitSimulationResults = ({
  data,
  onRestart,
  productName,
}: MarketFitSimulationResultsProps) => {
  const { simulation_analysis, recommendation, s3_keys } = data;

  // Add null/undefined checks to prevent destructuring errors
  if (!simulation_analysis) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="text-destructive">
              <strong>Error:</strong> Simulation analysis data is missing.
              Please try running the simulation again.
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>
    );
  }

  const { metadata, kpi_summary } = simulation_analysis;

  // Additional safety checks
  if (!metadata || !kpi_summary) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="text-destructive">
              <strong>Error:</strong> Simulation metadata or KPI summary is
              missing. Please try running the simulation again.
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>
    );
  }

  // Check for recommendation to prevent errors when rendering recommendations tab
  if (!recommendation) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="text-destructive">
              <strong>Error:</strong> Recommendation data is missing. Please try
              running the simulation again.
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
        </div>
      </div>
    );
  }

  const handleDownloadReport = async () => {
    try {
      const { generateMarketFitPDF } = await import(
        "../utils/generateMarketFitPDF"
      );
      generateMarketFitPDF(data, productName);
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  // Categorize KPIs
  const corePMFMetrics = kpi_summary.filter(
    (kpi) =>
      [
        "pmf_index",
        "adoption_rate",
        "retention_rate",
        "problem_solution_fit",
        "trial_to_adoption",
        "churn_probability",
      ].includes(kpi.kpi_metric.toLowerCase()) &&
      kpi.metric_type.toLowerCase() !== "calculated"
  );

  const growthConversionMetrics = kpi_summary.filter(
    (kpi) =>
      [
        "conversion_rate",
        "click_through_rate",
        "purchase_intent",
        "customer_acquisition_cost",
      ].includes(kpi.kpi_metric.toLowerCase()) &&
      kpi.metric_type.toLowerCase() !== "calculated"
  );

  const experienceValueMetrics = kpi_summary.filter(
    (kpi) =>
      ["satisfaction", "usability", "interest_level"].includes(
        kpi.kpi_metric.toLowerCase()
      ) && kpi.metric_type.toLowerCase() !== "calculated"
  );

  const pricePerceptionKpi = kpi_summary.find(
    (kpi) =>
      kpi.kpi_metric.toLowerCase() === "price_perception" &&
      kpi.metric_type.toLowerCase() !== "calculated"
  );

  return (
    <div className="space-y-6">
      {/* Header with buttons */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1" />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="text-gray-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadReport}
            className="bg-[#42bd00] text-white hover:bg-[#329600]"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kpi-summary" className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-0 border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger
            value="kpi-summary"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 transition-all data-[state=active]:border-[#42bd00] data-[state=active]:bg-transparent data-[state=active]:text-[#42bd00]"
          >
            Key Performance Indicators - KPIs
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 transition-all data-[state=active]:border-[#42bd00] data-[state=active]:bg-transparent data-[state=active]:text-[#42bd00]"
          >
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kpi-summary" className="mt-6 space-y-8">
          {/* Core PMF Metrics */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Core PMF Metrics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {corePMFMetrics.map((kpi) => (
                <KpiGaugeCard key={kpi.kpi_metric} kpi={kpi} />
              ))}
            </div>
          </div>

          {/* Growth & Conversion Metrics */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Growth & Conversion Metrics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {growthConversionMetrics.map((kpi) => (
                <KpiProgressBarCard key={kpi.kpi_metric} kpi={kpi} />
              ))}
            </div>
          </div>

          {/* Experience & Value Metrics */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Experience & Value Metrics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {experienceValueMetrics.map((kpi) => (
                <KpiCircularGaugeCard key={kpi.kpi_metric} kpi={kpi} />
              ))}
              {pricePerceptionKpi && (
                <SegmentedPricePerceptionGauge kpi={pricePerceptionKpi} />
              )}
            </div>
          </div>

          <AttachmentList attachments={s3_keys} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <section className="space-y-4">
            <div>
              <p className="text-foreground text-base font-semibold">
                Segment Analysis
              </p>
              <p className="text-muted-foreground text-sm">
                Deep dive into top personas, blockers, and activation paths.
              </p>
            </div>
            <div className="space-y-4">
              {recommendation.segment_analysis.map(
                (segment: MarketFitSegmentAnalysis) => (
                  <Card
                    key={segment.segment_name}
                    className="shadow-sm transition-shadow hover:shadow-md"
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-xl font-semibold">
                            {segment.segment_name}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm font-medium">
                            {segment.segment_size}
                          </p>
                        </div>
                        <Badge variant="outline" className="font-medium">
                          {segment.fit_level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5 text-sm leading-relaxed">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <ListSection
                            title="Demographics"
                            items={segment.key_characteristics.demographics}
                          />
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <ListSection
                            title="Behaviors"
                            items={segment.key_characteristics.behaviors}
                          />
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <ListSection
                            title="Pain points"
                            items={segment.key_characteristics.pain_points}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                          <ListSection
                            title="Strengths"
                            items={segment.strengths}
                          />
                        </div>
                        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/20">
                          <ListSection
                            title="Weaknesses"
                            items={segment.weaknesses}
                          />
                        </div>
                      </div>
                      <div className="space-y-3 border-t pt-4">
                        <p className="text-foreground text-sm font-semibold">
                          Specific recommendations
                        </p>
                        <div className="grid gap-3 md:grid-cols-2">
                          {segment.specific_recommendations.map(
                            (recommendationItem) => (
                              <RecommendationBlock
                                key={`${segment.segment_name}-${recommendationItem.category}-${recommendationItem.priority}`}
                                recommendation={recommendationItem}
                              />
                            )
                          )}
                        </div>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-3">
                        <p className="text-foreground mb-2 text-sm font-semibold">
                          Acquisition channels
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {segment.acquisition_channels.map((channel) => (
                            <Badge
                              key={channel}
                              variant="outline"
                              className="font-medium"
                            >
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-foreground text-base font-semibold">
                Critical Issues
              </p>
              <p className="text-muted-foreground text-sm">
                Urgent risks that block conversion or adoption.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendation.critical_issues.map((issue) => (
                <CriticalIssueCard key={issue.title} issue={issue} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-foreground text-base font-semibold">
                Product & Experience
              </p>
              <p className="text-muted-foreground text-sm">
                Near-term product changes to unlock adoption.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendation.product_modification.map((item) => (
                <ProductModificationCard
                  key={item.modification_area}
                  item={item}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-foreground text-base font-semibold">
                Value Proposition
              </p>
              <p className="text-muted-foreground text-sm">
                Messaging pivots aligned to each priority segment.
              </p>
            </div>
            <div className="space-y-4">
              {recommendation.value_proposition_rewrite.map((entry, index) => (
                <ValuePropRewriteCard key={index} rewrite={entry} />
              ))}
            </div>
          </section>

          {recommendation.answered_questions &&
            recommendation.answered_questions.length > 0 && (
              <section className="space-y-4">
                <div>
                  <p className="text-foreground text-base font-semibold">
                    Questions &amp; Answers from Simulation
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Natural language answers generated from the simulation run.
                  </p>
                </div>
                <div className="space-y-3">
                  {recommendation.answered_questions.map(
                    (qa: MarketFitAnsweredQuestion, index: number) => (
                      <Card key={`${qa.question}-${index}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold">
                            {qa.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-sm leading-relaxed">
                          <EmphasizedText text={qa.answer} />
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </section>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
