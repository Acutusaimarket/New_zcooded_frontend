import React, { useState } from "react";

import { Chart } from "@solar-icons/react-perf/BoldDuotone";
import { CheckCircle, Download, Search, Share } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FilteredMediaSimulationResponse } from "@/types/media-simulation.type";

// KPI Descriptions mapping
const KPI_DESCRIPTIONS: Record<string, string> = {
  // Brand Consistency
  "Brand Consistency":
    "Measures how well the ad's visuals, tone, and messaging align with overall brand guidelines and identity. Higher scores mean the creative feels clearly on-brand.",
  brand_consistency:
    "Measures how well the ad's visuals, tone, and messaging align with overall brand guidelines and identity. Higher scores mean the creative feels clearly on-brand.",

  // Message Clarity
  "Message Clarity":
    "Evaluates how easy it is for the target audience to understand the core message. Higher scores indicate clearer, more easily understood communication.",
  message_clarity:
    "Evaluates how easy it is for the target audience to understand the core message. Higher scores indicate clearer, more easily understood communication.",

  // Ad Frequency
  "Ad Frequency":
    "Represents the recommended average number of times an individual should see the ad within a campaign to maximize impact without causing fatigue.",
  ad_frequency:
    "Represents the recommended average number of times an individual should see the ad within a campaign to maximize impact without causing fatigue.",

  // Ad Recall Lift
  "Ad Recall Lift":
    "Measures the increase in the percentage of people who remember the ad after exposure compared to a control group. Higher values indicate stronger memorability.",
  ad_recall_lift:
    "Measures the increase in the percentage of people who remember the ad after exposure compared to a control group. Higher values indicate stronger memorability.",

  // Audience Fit
  "Audience Fit":
    "Assesses how well the ad matches the target audience's interests, needs, behaviors, and demographics. Higher scores show stronger alignment.",
  audience_fit:
    "Assesses how well the ad matches the target audience's interests, needs, behaviors, and demographics. Higher scores show stronger alignment.",

  // Bounce Rate Predictor
  "Bounce Rate Predictor":
    "Estimates the likelihood that users will leave the landing page quickly after clicking the ad. Lower values indicate stronger engagement and relevance.",
  bounce_rate_predictor:
    "Estimates the likelihood that users will leave the landing page quickly after clicking the ad. Lower values indicate stronger engagement and relevance.",

  // Click Through Rate (CTR)
  "Click Through Rate (CTR)":
    "Predicts the proportion of impressions that will result in clicks. Higher values indicate the ad attracts attention and drives traffic effectively.",
  click_through_rate:
    "Predicts the proportion of impressions that will result in clicks. Higher values indicate the ad attracts attention and drives traffic effectively.",

  // Conversion Rate
  "Conversion Rate":
    "Predicts the proportion of users who will complete a desired action (purchase, signup, lead) after interacting with the ad. Higher values indicate better outcomes.",
  conversion_rate:
    "Predicts the proportion of users who will complete a desired action (purchase, signup, lead) after interacting with the ad. Higher values indicate better outcomes.",

  // Cost Per Click (CPC) – Value Indicator
  "Cost Per Click (CPC) – Value Indicator":
    "Evaluates the expected cost efficiency of the ad in driving clicks for the spend. Higher scores mean more or higher-quality clicks per unit of spend.",
  cost_per_click:
    "Evaluates the expected cost efficiency of the ad in driving clicks for the spend. Higher scores mean more or higher-quality clicks per unit of spend.",

  // Engagement Rate
  "Engagement Rate":
    "Predicts how likely users are to interact with the ad (likes, comments, shares, saves, video plays). Higher values indicate more compelling, interactive content.",
  engagement_rate:
    "Predicts how likely users are to interact with the ad (likes, comments, shares, saves, video plays). Higher values indicate more compelling, interactive content.",

  // Impressions
  Impressions:
    "Indicates the expected strength of reach and visibility for the ad in a typical campaign. Higher values suggest greater likelihood of being seen.",
  impressions:
    "Indicates the expected strength of reach and visibility for the ad in a typical campaign. Higher values suggest greater likelihood of being seen.",

  // Information Seeking Intent
  "Information Seeking Intent":
    "Estimates how likely users are to look for more information about the brand, product, or offer after seeing the ad. Higher values show stronger curiosity.",
  information_seeking_intent:
    "Estimates how likely users are to look for more information about the brand, product, or offer after seeing the ad. Higher values show stronger curiosity.",

  // Lifetime Value Indicator (LTV Indicator)
  "Lifetime Value Indicator (LTV Indicator)":
    "Predicts the potential long-term revenue and profitability of customers acquired through this ad. Higher scores indicate more valuable, longer-retaining customers.",
  lifetime_value_indicator:
    "Predicts the potential long-term revenue and profitability of customers acquired through this ad. Higher scores indicate more valuable, longer-retaining customers.",

  // Memorability
  Memorability:
    "Measures how likely viewers are to remember the ad and associate it with the brand after exposure. Higher values indicate stronger recall.",
  memorability:
    "Measures how likely viewers are to remember the ad and associate it with the brand after exposure. Higher values indicate stronger recall.",

  // Net Promoter Score (NPS) – Impact Indicator
  "Net Promoter Score (NPS) – Impact Indicator":
    "Estimates how exposure to the ad may influence users' likelihood of recommending the brand to others. Higher values indicate stronger advocacy potential.",
  net_promoter_score:
    "Estimates how exposure to the ad may influence users' likelihood of recommending the brand to others. Higher values indicate stronger advocacy potential.",

  // Quality Score
  "Quality Score":
    "Provides an overall rating of the ad's creative quality, including design, visuals, copywriting, layout, and professionalism. Higher values signal polished creative.",
  quality_score:
    "Provides an overall rating of the ad's creative quality, including design, visuals, copywriting, layout, and professionalism. Higher values signal polished creative.",

  // Relevance
  Relevance:
    "Assesses how relevant the ad's message, offer, and creative are to the viewer's current interests or needs. Higher values mean a stronger match.",
  relevance:
    "Assesses how relevant the ad's message, offer, and creative are to the viewer's current interests or needs. Higher values mean a stronger match.",

  // ROAS (Return on Ad Spend)
  "ROAS (Return on Ad Spend)":
    "Predicts the expected revenue generated for each unit of ad spend. Higher ROAS indicates more efficient campaigns that drive more revenue per dollar invested.",
  ROAS:
    "Predicts the expected revenue generated for each unit of ad spend. Higher ROAS indicates more efficient campaigns that drive more revenue per dollar invested.",
};

// Helper function to format KPI name
const formatKPIName = (kpiMetric: string): string => {
  return kpiMetric
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to get percentage value as number
const getPercentageValue = (value: number | null): number => {
  if (value === null || value === undefined) return 0;
  // If value is already a percentage (0-100), use as-is, otherwise multiply by 100
  return value > 1 ? value : value * 100;
};

// Helper function to get color based on percentage
const getColorByPercentage = (percentage: number): string => {
  if (percentage <= 30) return "#ef4444"; // red
  if (percentage <= 75) return "#f97316"; // orange
  return "#22c55e"; // green
};

// Semi-Circular Progress Component
interface SemiCircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const SemiCircularProgress: React.FC<SemiCircularProgressProps> = ({
  value,
  size = 140,
  strokeWidth = 14,
  className,
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  // Semi-circle: 180 degrees = π radians
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getColorByPercentage(percentage);

  // Semi-circle path: bottom half of circle (from left to right)
  // Start at bottom-left, arc to bottom-right, curving upward
  const startX = centerX - radius;
  const startY = centerY;
  const endX = centerX + radius;
  const endY = centerY;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size / 2 + 30 }}
    >
      <svg
        width={size}
        height={size / 2 + 10}
        className="overflow-visible"
        style={{ display: "block" }}
      >
        {/* Background semi-circle - bottom half */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress semi-circle - fills from left to right */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      {/* Number positioned along the diameter of the semi-circle */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: `${size / 2}px`,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size,
        }}
      >
        <span
          className="text-4xl font-bold tracking-tight"
          style={{ color, fontFamily: "'Cormorant Garamond', serif" }}
        >
          {Math.round(percentage)}
        </span>
      </div>
    </div>
  );
};

// Helper function to get KPI description
const getKPIDescription = (kpiMetric: string): string => {
  return (
    KPI_DESCRIPTIONS[kpiMetric] ||
    KPI_DESCRIPTIONS[formatKPIName(kpiMetric)] ||
    `Description for ${formatKPIName(kpiMetric)}`
  );
};

const formatStatValue = (value?: number | null): string => {
  if (value === null || value === undefined) {
    return "—";
  }
  const normalizedValue = value > 1 ? value : value * 100;
  return `${Math.round(normalizedValue)}`;
};

interface MediaSimulationResultsProps {
  results: FilteredMediaSimulationResponse;
  onDownloadReport?: () => void;
  onShareResults?: () => void;
}

export const ImprovedMediaSimulationResults: React.FC<
  MediaSimulationResultsProps
> = ({ results, onDownloadReport, onShareResults }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Add null check for results
  if (!results) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No results available
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate summary statistics
  const kpiCount = results.kpi_summary?.length || 0;
  const recommendationCount =
    results.recommendation?.media_file_modifications?.length || 0;

  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-6"
      style={{ fontFamily: "'Alina', serif" }}
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Media Simulation Results
              </CardTitle>
              <CardDescription>
                Analysis completed with {kpiCount} KPI metrics and{" "}
                {recommendationCount} recommendations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {onShareResults && (
                <Button variant="outline" onClick={onShareResults}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              )}
              {onDownloadReport && (
                <Button onClick={onDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-3 grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Chart size={64} className="size-[1.5em]" />
            KPI Summary
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="min-h-[600px]">
          <div className="space-y-6">
            {results.kpi_summary && results.kpi_summary.length > 0 ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">KPI Summary</h3>
                  <p className="text-muted-foreground text-sm">
                    Key performance indicators with average responses
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.kpi_summary.map((kpi, index) => {
                    const percentage = getPercentageValue(kpi.average_response);
                    const description = getKPIDescription(kpi.kpi_metric);

                    return (
                      <Card
                        key={index}
                        className="bg-card transition-shadow hover:shadow-lg"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        <CardContent className="flex flex-col p-5">
                          {/* Semi-Circular Progress - Centered and aligned */}
                          <div className="mb-3 flex justify-center">
                            <SemiCircularProgress
                              value={percentage}
                              size={140}
                              strokeWidth={14}
                            />
                          </div>

                          {/* KPI Name - Below the percentage */}
                          <div className="mb-2 text-center">
                            <h3 className="text-lg font-semibold text-foreground">
                              {formatKPIName(kpi.kpi_metric)}
                            </h3>
                          </div>

                          {/* Description Text */}
                          <p className="text-center text-sm text-muted-foreground">
                            {description}
                          </p>

                          {/* Min / Avg / Max */}
                          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                            <div>
                              <p className="text-lg font-semibold text-foreground">
                                {formatStatValue(kpi.min_response)}
                              </p>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Min
                              </p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-foreground">
                                {Math.round(percentage)}
                              </p>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Avg
                              </p>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-foreground">
                                {formatStatValue(kpi.max_response)}
                              </p>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Max
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No KPI summary data available
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="min-h-[600px]">
          <div className="space-y-6">
            {/* Visual Analysis Section */}
            {results.visual_analysis && results.visual_analysis.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Visual Analysis</h3>
                {results.visual_analysis.map((analysis, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>Visual Analysis {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {analysis.summary && (
                          <div className="mb-4">
                            <h4 className="mb-2 font-semibold">Summary</h4>
                            <ReactMarkdown>{analysis.summary}</ReactMarkdown>
                          </div>
                        )}
                        {analysis.detailed_description && (
                          <div className="mb-4">
                            <h4 className="mb-2 font-semibold">
                              Detailed Description
                            </h4>
                            <ReactMarkdown>
                              {analysis.detailed_description}
                            </ReactMarkdown>
                          </div>
                        )}
                        {analysis.marketing_insights && (
                          <div className="mb-4">
                            <h4 className="mb-2 font-semibold">
                              Marketing Insights
                            </h4>
                            <ReactMarkdown>
                              {analysis.marketing_insights}
                            </ReactMarkdown>
                          </div>
                        )}
                        {analysis.suggested_context && (
                          <div className="mb-4">
                            <h4 className="mb-2 font-semibold">
                              Suggested Context
                            </h4>
                            <ReactMarkdown>
                              {analysis.suggested_context}
                            </ReactMarkdown>
                          </div>
                        )}
                        {analysis.key_elements && analysis.key_elements.length > 0 && (
                          <div className="mb-4">
                            <h4 className="mb-2 font-semibold">Key Elements</h4>
                            <ul className="ml-4 list-disc">
                              {analysis.key_elements.map((element, i) => (
                                <li key={i}>{element}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Recommendations Section */}
            {results.recommendation?.media_file_modifications &&
            results.recommendation.media_file_modifications.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recommendations</h3>
                {results.recommendation.media_file_modifications.map(
                  (mod, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>
                          {mod.modification_area || `Recommendation ${index + 1}`}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {mod.current_state && (
                            <div className="mb-4">
                              <h4 className="mb-2 font-semibold">
                                Current State
                              </h4>
                              <ReactMarkdown>{mod.current_state}</ReactMarkdown>
                            </div>
                          )}
                          {mod.recommended_state && (
                            <div className="mb-4">
                              <h4 className="mb-2 font-semibold">
                                Recommended State
                              </h4>
                              <ReactMarkdown>
                                {mod.recommended_state}
                              </ReactMarkdown>
                            </div>
                          )}
                          {mod.specific_changes && (
                            <div className="mb-4">
                              <h4 className="mb-2 font-semibold">
                                Specific Changes
                              </h4>
                              <div className="space-y-3">
                                {mod.specific_changes.visuals?.add &&
                                  mod.specific_changes.visuals.add.length > 0 && (
                                    <div>
                                      <p className="mb-2 font-medium">Add:</p>
                                      <ul className="ml-4 list-disc">
                                        {mod.specific_changes.visuals.add.map(
                                          (item, i) => (
                                            <li key={i}>
                                              <ReactMarkdown>{item}</ReactMarkdown>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {mod.specific_changes.visuals?.remove &&
                                  mod.specific_changes.visuals.remove.length >
                                    0 && (
                                    <div>
                                      <p className="mb-2 font-medium">Remove:</p>
                                      <ul className="ml-4 list-disc">
                                        {mod.specific_changes.visuals.remove.map(
                                          (item, i) => (
                                            <li key={i}>
                                              <ReactMarkdown>{item}</ReactMarkdown>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {mod.specific_changes.visuals?.modify &&
                                  mod.specific_changes.visuals.modify.length >
                                    0 && (
                                    <div>
                                      <p className="mb-2 font-medium">Modify:</p>
                                      <ul className="ml-4 list-disc">
                                        {mod.specific_changes.visuals.modify.map(
                                          (item, i) => (
                                            <li key={i}>
                                              <ReactMarkdown>{item}</ReactMarkdown>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {mod.specific_changes.opening_frame && (
                                  <div>
                                    <p className="mb-2 font-medium">
                                      Opening Frame:
                                    </p>
                                    <ReactMarkdown>
                                      {mod.specific_changes.opening_frame}
                                    </ReactMarkdown>
                                  </div>
                                )}
                                {mod.specific_changes.platform_optimization && (
                                  <div>
                                    <p className="mb-2 font-medium">
                                      Platform Optimization:
                                    </p>
                                    <ReactMarkdown>
                                      {mod.specific_changes.platform_optimization}
                                    </ReactMarkdown>
                                  </div>
                                )}
                                {mod.specific_changes.video_structure &&
                                  mod.specific_changes.video_structure.length >
                                    0 && (
                                    <div>
                                      <p className="mb-2 font-medium">
                                        Video Structure:
                                      </p>
                                      <ul className="ml-4 list-disc">
                                        {mod.specific_changes.video_structure.map(
                                          (item, i) => (
                                            <li key={i}>
                                              <strong>{item.timestamp}:</strong>{" "}
                                              <ReactMarkdown>
                                                {item.content}
                                              </ReactMarkdown>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                {mod.specific_changes.trust_indicators_to_add &&
                                  mod.specific_changes.trust_indicators_to_add
                                    .length > 0 && (
                                    <div>
                                      <p className="mb-2 font-medium">
                                        Trust Indicators to Add:
                                      </p>
                                      <ul className="ml-4 list-disc">
                                        {mod.specific_changes.trust_indicators_to_add.map(
                                          (item, i) => (
                                            <li key={i}>
                                              <ReactMarkdown>{item}</ReactMarkdown>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                          {mod.script_rewrite && (
                            <div className="mb-4">
                              <h4 className="mb-2 font-semibold">
                                Script Rewrite
                              </h4>
                              {mod.script_rewrite.current_hook && (
                                <div className="mb-3">
                                  <p className="mb-2 font-medium">
                                    Current Hook:
                                  </p>
                                  <ReactMarkdown>
                                    {mod.script_rewrite.current_hook}
                                  </ReactMarkdown>
                                </div>
                              )}
                              {mod.script_rewrite.recommended_hook && (
                                <div className="mb-3">
                                  <p className="mb-2 font-medium">
                                    Recommended Hook:
                                  </p>
                                  <ReactMarkdown>
                                    {mod.script_rewrite.recommended_hook}
                                  </ReactMarkdown>
                                </div>
                              )}
                              {mod.script_rewrite.key_messages_to_add &&
                                mod.script_rewrite.key_messages_to_add.length >
                                  0 && (
                                  <div>
                                    <p className="mb-2 font-medium">
                                      Key Messages to Add:
                                    </p>
                                    <ul className="ml-4 list-disc">
                                      {mod.script_rewrite.key_messages_to_add.map(
                                        (msg, i) => (
                                          <li key={i}>
                                            <ReactMarkdown>{msg}</ReactMarkdown>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No recommendations available
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
