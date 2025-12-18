import React from "react";

import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaSimulationData {
  _id: string;
  job: string;
  simulation_type: string;
  simulation_analysis: {
    metadata: {
      generated_at: string;
      total_responses: number;
      numeric_responses: number;
      excluded_kpis: string[];
      unique_agents: number;
      unique_kpis: number;
      num_questions: number;
    };
    kpi_summary: Array<{
      kpi_metric: string;
      metric_type: string;
      num_responses: number | null;
      total_response: number | null;
      average_response: number | null;
      std_dev: number | null;
      min_response: number | null;
      max_response: number | null;
      formatted_roas?: string | null;
    }>;
  };
  visual_analysis?: Array<Record<string, unknown>>;
  recommendation?: {
    media_file_modifications?: Array<{
      modification_area: string;
      current_state: string;
      recommended_state: string;
      expected_impact?: Array<{
        metric_name: string;
        expected_change: string;
        confidence_level: string;
      }>;
      specific_changes?: {
        visuals?: {
          add?: string[];
          remove?: string[];
          modify?: string[];
        };
        script_rewrite?: {
          current_hook?: string;
          recommended_hook?: string;
          key_messages_to_add?: string[];
        };
        audio_modifications?: {
          voiceover_tone?: string;
          background_music?: string;
        };
        opening_frame?: string;
        disclaimer_addition?: string;
        platform_optimization?: string;
        video_structure?: Array<{
          timestamp: string;
          content: string;
        }>;
        trust_indicators_to_add?: string[];
      };
    }>;
    alternative_strategy?: {
      scenario?: string;
      recommendation?: string;
      targeting_refinements?: {
        negative_audience_exclusions?: string[];
        positive_targeting?: Record<string, unknown>;
      };
      justification?: string;
    };
  };
  answered_questions?: Array<{
    question: string;
    answer: string;
  }>;
  simulation_status?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface MediaSimulationResultsProps {
  data: MediaSimulationData;
  onRestart: () => void;
}

const titleCase = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

// KPI Descriptions mapping
const KPI_DESCRIPTIONS: Record<string, string> = {
  // Brand Consistency
  "Brand Consistency":
    "How closely the ad follows the brand's visual and messaging style.",
  brand_consistency:
    "How closely the ad follows the brand's visual and messaging style.",

  // Message Clarity
  "Message Clarity": "How clearly the ad's message is understood.",
  message_clarity: "How clearly the ad's message is understood.",

  // Ad Frequency
  "Ad Frequency": "Overall happiness with the experience of product.",
  ad_frequency: "Overall happiness with the experience of product.",

  // Ad Recall Lift
  "Ad Recall Lift": "How easy and intuitive the product feels.",
  ad_recall_lift: "How easy and intuitive the product feels.",

  // Audience Fit
  "Audience Fit": "Likelihood that a user will stop using the product.",
  audience_fit: "Likelihood that a user will stop using the product.",

  // Bounce Rate Predictor
  "Bounce Rate Predictor": "Likelihood users will leave the page quickly.",
  bounce_rate_predictor: "Likelihood users will leave the page quickly.",

  // Click Through Rate (CTR)
  "Click Through Rate (CTR)": "Chance of viewers clicking the ad.",
  click_through_rate: "Chance of viewers clicking the ad.",

  // Conversion Rate
  "Conversion Rate": "Chance of users completing the desired action.",
  conversion_rate: "Chance of users completing the desired action.",

  // Cost Per Click (CPC) – Value Indicator
  "Cost Per Click (CPC) – Value Indicator":
    "Cost efficiency of the ad in driving clicks.",
  cost_per_click: "Cost efficiency of the ad in driving clicks.",

  // Engagement Rate
  "Engagement Rate": "Likelihood of users interacting with the ad.",
  engagement_rate: "Likelihood of users interacting with the ad.",

  // Impressions
  Impressions: "Indicates how well the product/ad was seen by the audience.",
  impressions: "Indicates how well the product/ad was seen by the audience.",

  // Information Seeking Intent
  "Information Seeking Intent": "Chance users will look up more details.",
  information_seeking_intent: "Chance users will look up more details.",

  // Lifetime Value Indicator (LTV Indicator)
  "Lifetime Value Indicator (LTV Indicator)":
    "Potential long-term revenue and profitability of customers.",
  lifetime_value_indicator:
    "Potential long-term revenue and profitability of customers.",
  lifetime_value: "Potential long-term revenue and profitability of customers.",

  // Memorability
  Memorability: "How strongly the ad sticks in memory.",
  memorability: "How strongly the ad sticks in memory.",

  // Net Promoter Score (NPS) – Impact Indicator
  "Net Promoter Score (NPS) – Impact Indicator":
    "Likelihood of users recommending the brand to others.",
  net_promoter_score: "Likelihood of users recommending the brand to others.",

  // Quality Score
  "Quality Score": "Overall creative and execution quality.",
  quality_score: "Overall creative and execution quality.",

  // Relevance
  Relevance: "How well the ad matches user needs.",
  relevance: "How well the ad matches user needs.",

  // ROAS (Return on Ad Spend)
  "ROAS (Return on Ad Spend)":
    "Expected revenue generated for each unit of ad spend.",
  ROAS: "Expected revenue generated for each unit of ad spend.",
  roas: "Expected revenue generated for each unit of ad spend.",
  return_on_ad_spend: "Expected revenue generated for each unit of ad spend.",
};

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

const getScoreVisuals = (value: number, kpiMetric?: string) => {
  // Always green for Ad Frequency and ROAS
  const metricLower = kpiMetric?.toLowerCase() || "";
  if (metricLower === "ad_frequency" || metricLower === "roas") {
    return {
      colorHex: "#42bd00",
      textClass: "text-[#42bd00]",
      bgColor: "bg-[#42bd00]",
    };
  }

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

// Semi-circular gauge for Creative & Message Health and Value & Revenue Efficiency
const KpiGaugeCard = ({
  kpi,
}: {
  kpi: MediaSimulationData["simulation_analysis"]["kpi_summary"][0];
}) => {
  // Handle different response formats (0-1 scale or 0-100 scale)
  const rawValue = kpi.average_response ?? 0;
  const percentage =
    rawValue <= 1 && rawValue >= 0
      ? Math.max(0, Math.min(100, Math.round(rawValue * 100)))
      : Math.max(0, Math.min(100, Math.round(rawValue)));
  const visuals = getScoreVisuals(percentage, kpi.kpi_metric);

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
          <p className="text-xs text-gray-600">
            {KPI_DESCRIPTIONS[kpi.kpi_metric] ||
              KPI_DESCRIPTIONS[titleCase(kpi.kpi_metric)] ||
              kpi.metric_type}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Horizontal progress bar for Engagement & Action Prediction
const KpiProgressBarCard = ({
  kpi,
}: {
  kpi: MediaSimulationData["simulation_analysis"]["kpi_summary"][0];
}) => {
  const rawValue = kpi.average_response ?? 0;
  const percentage =
    rawValue <= 1 && rawValue >= 0
      ? Math.max(0, Math.min(100, Math.round(rawValue * 100)))
      : Math.max(0, Math.min(100, Math.round(rawValue)));
  const visuals = getScoreVisuals(percentage, kpi.kpi_metric);

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
          <p className="text-xs text-gray-600">
            {KPI_DESCRIPTIONS[kpi.kpi_metric] ||
              KPI_DESCRIPTIONS[titleCase(kpi.kpi_metric)] ||
              kpi.metric_type}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Circular gauge for Reach, Recall & Delivery
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

const KpiCircularGaugeCard = ({
  kpi,
}: {
  kpi: MediaSimulationData["simulation_analysis"]["kpi_summary"][0];
}) => {
  const rawValue = kpi.average_response ?? 0;
  const percentage =
    rawValue <= 1 && rawValue >= 0
      ? Math.max(0, Math.min(100, Math.round(rawValue * 100)))
      : Math.max(0, Math.min(100, Math.round(rawValue)));
  const visuals = getScoreVisuals(percentage, kpi.kpi_metric);

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
          <p className="text-xs text-gray-600">
            {KPI_DESCRIPTIONS[kpi.kpi_metric] ||
              KPI_DESCRIPTIONS[titleCase(kpi.kpi_metric)] ||
              kpi.metric_type}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Segmented semi-circular gauge for Value & Revenue Efficiency
const SegmentedGaugeCard = ({
  kpi,
}: {
  kpi: MediaSimulationData["simulation_analysis"]["kpi_summary"][0];
}) => {
  const rawValue = kpi.average_response ?? 0;
  const percentage =
    rawValue <= 1 && rawValue >= 0
      ? Math.max(0, Math.min(100, Math.round(rawValue * 100)))
      : Math.max(0, Math.min(100, Math.round(rawValue)));
  const visuals = getScoreVisuals(percentage, kpi.kpi_metric);

  // Simulated segments - in real app, these would come from the API
  const highValue = Math.round(percentage * 0.68);
  const moderateValue = Math.round(percentage * 0.22);
  const lowValue = Math.round(percentage * 0.1);

  // Get segment labels based on metric
  const metricLower = kpi.kpi_metric.toLowerCase();
  const isRoas = metricLower === "roas" || metricLower === "return_on_ad_spend";

  let segmentLabels = {
    high: "High value (low cost, good clicks)",
    moderate: "Moderate value",
    low: "Low value (high cost, weak clicks)",
  };

  if (isRoas) {
    segmentLabels = {
      high: "Strong return",
      moderate: "Average return",
      low: "Low return",
    };
  } else if (metricLower.includes("ltv") || metricLower.includes("lifetime")) {
    segmentLabels = {
      high: "High long-term value",
      moderate: "Medium value",
      low: "Low value users",
    };
  } else if (metricLower.includes("nps") || metricLower.includes("promoter")) {
    segmentLabels = {
      high: "Promoters",
      moderate: "Passive",
      low: "Detractors",
    };
  }

  // For ROAS, show formatted_roas if available, otherwise show percentage
  const displayValue =
    isRoas && kpi.formatted_roas ? kpi.formatted_roas : `${percentage}%`;

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
              {displayValue}
            </span>
          </div>
        </div>
        <div className="w-full space-y-2">
          <p className="text-base font-semibold text-gray-900">
            {titleCase(kpi.kpi_metric)}
          </p>
          {!isRoas && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[#42bd00]" />
                  <span className="text-gray-700">
                    {highValue}% {segmentLabels.high}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-orange-500" />
                  <span className="text-gray-700">
                    {moderateValue}% {segmentLabels.moderate}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-red-500" />
                  <span className="text-gray-700">
                    {lowValue}% {segmentLabels.low}
                  </span>
                </div>
              </div>
            </div>
          )}
          <p className="mt-2 text-xs text-gray-600">
            {KPI_DESCRIPTIONS[kpi.kpi_metric] ||
              KPI_DESCRIPTIONS[titleCase(kpi.kpi_metric)] ||
              kpi.metric_type}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

type MediaFileModification = NonNullable<
  NonNullable<MediaSimulationData["recommendation"]>["media_file_modifications"]
>[number];

const ModificationCard = ({
  modification,
}: {
  modification: MediaFileModification;
}) => (
  <Card className="shadow-sm transition-shadow hover:shadow-md">
    <CardHeader className="space-y-3 pb-4">
      <CardTitle className="text-xl font-semibold">
        {modification.modification_area}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-5 text-sm leading-relaxed">
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Current State
        </p>
        <p className="text-foreground">{modification.current_state}</p>
      </div>
      <div className="bg-primary/5 rounded-lg p-4">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
          Recommended State
        </p>
        <p className="text-foreground font-medium">
          {modification.recommended_state}
        </p>
      </div>

      {modification.specific_changes && (
        <div className="space-y-4 border-t pt-4">
          <p className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
            Specific Changes
          </p>

          {modification.specific_changes.visuals && (
            <div className="bg-card space-y-3 rounded-lg border p-4">
              <p className="text-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Visual Changes
              </p>
              {modification.specific_changes.visuals.add &&
                modification.specific_changes.visuals.add.length > 0 && (
                  <div className="rounded-md bg-green-50 p-3 dark:bg-green-950/20">
                    <p className="mb-2 text-xs font-semibold text-green-700 dark:text-green-400">
                      Add:
                    </p>
                    <ul className="list-disc space-y-1.5 pl-5 text-xs">
                      {modification.specific_changes.visuals.add.map(
                        (item: string, idx: number) => (
                          <li key={idx} className="text-foreground">
                            <EmphasizedText text={item} />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              {modification.specific_changes.visuals.remove &&
                modification.specific_changes.visuals.remove.length > 0 && (
                  <div className="rounded-md bg-red-50 p-3 dark:bg-red-950/20">
                    <p className="mb-2 text-xs font-semibold text-red-700 dark:text-red-400">
                      Remove:
                    </p>
                    <ul className="list-disc space-y-1.5 pl-5 text-xs">
                      {modification.specific_changes.visuals.remove.map(
                        (item: string, idx: number) => (
                          <li key={idx} className="text-foreground">
                            <EmphasizedText text={item} />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              {modification.specific_changes.visuals.modify &&
                modification.specific_changes.visuals.modify.length > 0 && (
                  <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
                    <p className="mb-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
                      Modify:
                    </p>
                    <ul className="list-disc space-y-1.5 pl-5 text-xs">
                      {modification.specific_changes.visuals.modify.map(
                        (item: string, idx: number) => (
                          <li key={idx} className="text-foreground">
                            <EmphasizedText text={item} />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {modification.specific_changes.script_rewrite && (
            <div className="bg-card rounded-lg border p-4">
              <p className="text-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Script Rewrite
              </p>
              {modification.specific_changes.script_rewrite.current_hook && (
                <div className="mb-2">
                  <p className="text-muted-foreground mb-1 text-xs">
                    Current Hook:
                  </p>
                  <p className="text-xs">
                    {modification.specific_changes.script_rewrite.current_hook}
                  </p>
                </div>
              )}
              {modification.specific_changes.script_rewrite
                .recommended_hook && (
                <div className="mb-2">
                  <p className="text-muted-foreground mb-1 text-xs">
                    Recommended Hook:
                  </p>
                  <p className="text-xs font-medium">
                    {
                      modification.specific_changes.script_rewrite
                        .recommended_hook
                    }
                  </p>
                </div>
              )}
              {modification.specific_changes.script_rewrite
                .key_messages_to_add &&
                modification.specific_changes.script_rewrite.key_messages_to_add
                  .length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">
                      Key Messages to Add:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-xs">
                      {modification.specific_changes.script_rewrite.key_messages_to_add.map(
                        (msg: string, idx: number) => (
                          <li key={idx}>
                            <EmphasizedText text={msg} />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {modification.specific_changes.audio_modifications && (
            <div className="bg-card rounded-lg border p-4">
              <p className="text-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Audio Modifications
              </p>
              {modification.specific_changes.audio_modifications
                .voiceover_tone && (
                <p className="text-xs">
                  <span className="font-medium">Voiceover Tone:</span>{" "}
                  {
                    modification.specific_changes.audio_modifications
                      .voiceover_tone
                  }
                </p>
              )}
              {modification.specific_changes.audio_modifications
                .background_music && (
                <p className="text-xs">
                  <span className="font-medium">Background Music:</span>{" "}
                  {
                    modification.specific_changes.audio_modifications
                      .background_music
                  }
                </p>
              )}
            </div>
          )}

          {modification.specific_changes.opening_frame && (
            <div className="rounded-md border border-dashed p-3">
              <p className="mb-2 text-xs font-semibold">Opening Frame</p>
              <p className="text-xs">
                <EmphasizedText
                  text={modification.specific_changes.opening_frame}
                />
              </p>
            </div>
          )}

          {modification.specific_changes.disclaimer_addition && (
            <div className="rounded-md border border-dashed p-3">
              <p className="mb-2 text-xs font-semibold">Disclaimer Addition</p>
              <p className="text-xs">
                <EmphasizedText
                  text={modification.specific_changes.disclaimer_addition}
                />
              </p>
            </div>
          )}

          {modification.specific_changes.platform_optimization && (
            <div className="rounded-md border border-dashed p-3">
              <p className="mb-2 text-xs font-semibold">
                Platform Optimization
              </p>
              <p className="text-xs">
                <EmphasizedText
                  text={modification.specific_changes.platform_optimization}
                />
              </p>
            </div>
          )}

          {modification.specific_changes.trust_indicators_to_add &&
            modification.specific_changes.trust_indicators_to_add.length >
              0 && (
              <div className="rounded-md border border-dashed p-3">
                <p className="mb-2 text-xs font-semibold">
                  Trust Indicators to Add
                </p>
                <ul className="list-disc space-y-1 pl-5 text-xs">
                  {modification.specific_changes.trust_indicators_to_add.map(
                    (indicator: string, idx: number) => (
                      <li key={idx}>
                        <EmphasizedText text={indicator} />
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
        </div>
      )}
    </CardContent>
  </Card>
);

export const MediaSimulationResults = ({
  data,
  onRestart,
}: MediaSimulationResultsProps) => {
  const { simulation_analysis, recommendation } = data;

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

  const handleDownloadReport = async () => {
    try {
      const { generateMediaSimulationPDF } = await import(
        "../utils/generateMediaSimulationPDF"
      );
      await generateMediaSimulationPDF(data);
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  // Categorize KPIs into sections
  const creativeMessageHealth = kpi_summary.filter(
    (kpi) =>
      [
        "brand_consistency",
        "message_clarity",
        "relevance",
        "quality_score",
        "memorability",
      ].includes(kpi.kpi_metric.toLowerCase()) &&
      kpi.metric_type.toLowerCase() !== "calculated"
  );

  const engagementActionPrediction = kpi_summary.filter(
    (kpi) =>
      [
        "engagement_rate",
        "click_through_rate",
        "information_seeking_intent",
        "conversion_rate",
        "bounce_rate_predictor",
      ].includes(kpi.kpi_metric.toLowerCase()) &&
      kpi.metric_type.toLowerCase() !== "calculated"
  );

  const valueRevenueEfficiency = kpi_summary.filter((kpi) => {
    const metricLower = kpi.kpi_metric.toLowerCase();
    const isValueRevenueMetric = [
      "cost_per_click",
      "roas",
      "return_on_ad_spend",
      "lifetime_value_indicator",
      "lifetime_value",
      "net_promoter_score",
    ].includes(metricLower);
    // Always include ROAS even if marked as calculated
    if (metricLower === "roas" || metricLower === "return_on_ad_spend") {
      return isValueRevenueMetric;
    }
    return (
      isValueRevenueMetric && kpi.metric_type.toLowerCase() !== "calculated"
    );
  });

  const reachRecallDelivery = kpi_summary.filter(
    (kpi) =>
      [
        "impressions",
        "ad_recall_lift",
        "ad_frequency",
        "audience_fit",
      ].includes(kpi.kpi_metric.toLowerCase()) &&
      kpi.metric_type.toLowerCase() !== "calculated"
  );

  return (
    <div className="space-y-8">
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

      <Tabs defaultValue="kpi" className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-0 border-b border-gray-200 bg-transparent p-0">
          <TabsTrigger
            value="kpi"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 transition-all data-[state=active]:border-[#42bd00] data-[state=active]:bg-transparent data-[state=active]:text-[#42bd00]"
          >
            Key Performance Indicator - KPIs
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-600 transition-all data-[state=active]:border-[#42bd00] data-[state=active]:bg-transparent data-[state=active]:text-[#42bd00]"
          >
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kpi" className="mt-6 space-y-8">
          {/* Creative & Message Health */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Creative & Message Health
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {creativeMessageHealth.map((kpi) => (
                <KpiGaugeCard key={kpi.kpi_metric} kpi={kpi} />
              ))}
            </div>
          </div>

          {/* Engagement & Action Prediction */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Engagement & Action Prediction
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {engagementActionPrediction.map((kpi) => (
                <KpiProgressBarCard key={kpi.kpi_metric} kpi={kpi} />
              ))}
            </div>
          </div>

          {/* Value & Revenue Efficiency */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Value & Revenue Efficiency
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {valueRevenueEfficiency.map((kpi) => (
                <SegmentedGaugeCard key={kpi.kpi_metric} kpi={kpi} />
              ))}
            </div>
          </div>

          {/* Reach, Recall & Delivery */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              Reach, Recall & Delivery
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {reachRecallDelivery.map((kpi) => (
                <KpiCircularGaugeCard key={kpi.kpi_metric} kpi={kpi} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {recommendation?.media_file_modifications &&
          recommendation.media_file_modifications.length > 0 ? (
            <section className="space-y-4">
              <div className="space-y-4">
                {recommendation.media_file_modifications.map(
                  (modification, index) => (
                    <ModificationCard
                      key={`${modification.modification_area}-${index}`}
                      modification={modification}
                    />
                  )
                )}
              </div>
            </section>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-8 text-center">
                No recommendations available
              </CardContent>
            </Card>
          )}

          {recommendation?.alternative_strategy && (
            <section className="space-y-3">
              <div>
                <p className="text-sm font-semibold">Alternative Strategy</p>
                <p className="text-muted-foreground text-sm">
                  Alternative approach if current recommendations don't yield
                  expected results.
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {recommendation.alternative_strategy.scenario ||
                      "Alternative Strategy"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed">
                  {recommendation.alternative_strategy.recommendation && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs uppercase">
                        Recommendation
                      </p>
                      <p>
                        <EmphasizedText
                          text={
                            recommendation.alternative_strategy.recommendation
                          }
                        />
                      </p>
                    </div>
                  )}
                  {recommendation.alternative_strategy.justification && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs uppercase">
                        Justification
                      </p>
                      <p>
                        <EmphasizedText
                          text={
                            recommendation.alternative_strategy.justification
                          }
                        />
                      </p>
                    </div>
                  )}
                  {recommendation.alternative_strategy
                    .targeting_refinements && (
                    <div>
                      <p className="text-muted-foreground mb-2 text-xs uppercase">
                        Targeting Refinements
                      </p>
                      {recommendation.alternative_strategy.targeting_refinements
                        .negative_audience_exclusions &&
                        recommendation.alternative_strategy
                          .targeting_refinements.negative_audience_exclusions
                          .length > 0 && (
                          <div className="mb-3">
                            <p className="mb-1 text-xs font-semibold">
                              Negative Exclusions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {recommendation.alternative_strategy.targeting_refinements.negative_audience_exclusions.map(
                                (exclusion, idx) => (
                                  <Badge key={idx} variant="outline">
                                    {exclusion}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {data.answered_questions && data.answered_questions.length > 0 && (
            <section className="space-y-3">
              <div>
                <p className="text-sm font-semibold">
                  Questions &amp; Answers from Simulation
                </p>
                <p className="text-muted-foreground text-sm">
                  Natural language answers generated from the simulation run.
                </p>
              </div>
              <div className="space-y-3">
                {data.answered_questions.map((qa, index) => (
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
                ))}
              </div>
            </section>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
