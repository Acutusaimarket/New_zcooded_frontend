import { useState } from "react";

import { PieChart2 } from "@solar-icons/react-perf/BoldDuotone";
import { HelpCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type {
  MediaAnalysis,
  MediaFile,
  MediaSimulationData,
} from "../../types/media-simulation.types";
import { transformKPIToRadarData } from "../../utils/chart-helpers";
import { formatMediaSize, formatTimestamp } from "../../utils/data-formatters";
import { KPIRadarChart } from "../charts/KPIRadarChart";
import KPIRatesBarChart from "../charts/KPIRatesBarChart";
import { MediaMetricInfoTooltip } from "../media-metric-info-tooltip";

interface IndividualAnalysisProps {
  data: MediaSimulationData;
  selectedAnalysisId?: string;
  onAnalysisSelect?: (analysisId: string) => void;
  className?: string;
}

interface AnalysisCardProps {
  analysis: MediaAnalysis;
  mediaFile: MediaFile;
  isSelected: boolean;
  onSelect: () => void;
  personaName: string;
}

const getEffectivenessStatus = (score: number) => {
  if (score >= 80) return { label: "Excellent", variant: "default" as const };
  if (score >= 60) return { label: "Good", variant: "secondary" as const };
  if (score >= 40) return { label: "Average", variant: "outline" as const };
  return { label: "Poor", variant: "destructive" as const };
};
const AnalysisCard = ({
  analysis,
  mediaFile,
  personaName,
}: AnalysisCardProps) => {
  const radarData = transformKPIToRadarData(analysis.kpi_metrics);

  const effectivenessStatus = getEffectivenessStatus(
    analysis.kpi_metrics.overall_effectiveness
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {mediaFile?.media_id.replace(/_[0-9a-fA-F-]{36}$/, "") ||
                "Unknown Media"}
              &nbsp;v/s&nbsp;{personaName}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {formatTimestamp(analysis.timestamp)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={effectivenessStatus.variant}>
              {analysis.kpi_metrics.overall_effectiveness}/100
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {analysis.kpi_metrics.engagement_potential.toFixed(1)}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-muted-foreground text-xs">Engagement</p>
              <MediaMetricInfoTooltip metric="engagement" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {analysis.kpi_metrics.message_clarity.toFixed(1)}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-muted-foreground text-xs">Clarity</p>
              <MediaMetricInfoTooltip metric="clarity" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {analysis.kpi_metrics.conversion_potential.toFixed(1)}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-muted-foreground text-xs">Conversion</p>
              <MediaMetricInfoTooltip metric="conversion" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {analysis.kpi_metrics.brand_consistency.toFixed(1)}
            </p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-muted-foreground text-xs">Brand</p>
              <MediaMetricInfoTooltip metric="brand consistency" />
            </div>
          </div>
        </div>

        {/* Expandable Detailed Analysis */}
        <div className="space-y-4">
          <Collapsible>
            <CollapsibleTrigger
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  className: "flex w-full items-center justify-center gap-2",
                  size: "sm",
                })
              )}
            >
              Show Details
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-6">
                {/* KPI Radar Chart */}
                <div className="w-full">
                  <h4 className="mb-3 font-semibold">KPI Breakdown</h4>
                  <div className="bg-card h-[350px] w-full overflow-hidden rounded-lg border p-4">
                    {radarData && radarData.length > 0 ? (
                      <KPIRadarChart
                        data={radarData}
                        height={300}
                        className="w-full"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                          No KPI data available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Recall & Brand Outcomes */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Recall & Brand Outcomes</h4>

                  {/* Counts */}
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Users who recall ad
                        </p>
                        <MediaMetricInfoTooltip metric="ad recall" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.users_who_recall_ad.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Users who recall message
                        </p>
                        <MediaMetricInfoTooltip metric="message recall" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.users_who_recall_message.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Associate ad with brand
                        </p>
                        <MediaMetricInfoTooltip metric="brand linkage" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.user_associating_ad_with_brand.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Considering buying
                        </p>
                        <MediaMetricInfoTooltip metric="consideration" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.users_considering_buying.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Brand trust (agree)
                        </p>
                        <MediaMetricInfoTooltip metric="brand trust" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.users_agreeing_brand_trust.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Creative appeal
                        </p>
                        <MediaMetricInfoTooltip metric="creative appeal" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.users_who_creative_appeal.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Understood message
                        </p>
                        <MediaMetricInfoTooltip metric="clarity of message" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.users_understood_message.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Said ad was distinctive
                        </p>
                        <MediaMetricInfoTooltip metric="distinctiveness" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.users_saying_ad_was_distinctive.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs">
                          Share intent
                        </p>
                        <MediaMetricInfoTooltip metric="share intent" />
                      </div>
                      <p className="text-base font-bold">
                        {analysis.kpi_metrics.users_share_intent.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground mt-1 text-[11px]">
                        of{" "}
                        {analysis.kpi_metrics.total_users_simulated.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Rates */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Ad Recall Rate
                          </p>
                          <MediaMetricInfoTooltip metric="ad recall rate" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.ad_recall_rate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={analysis.kpi_metrics.ad_recall_rate} />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Message Recall Rate
                          </p>
                          <MediaMetricInfoTooltip metric="message recall rate" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.message_recall_rate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.message_recall_rate}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Brand Linkage Rate
                          </p>
                          <MediaMetricInfoTooltip metric="brand linkage rate" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.brand_linkage_rate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.brand_linkage_rate}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Affective Uplift
                          </p>
                          <MediaMetricInfoTooltip metric="affective uplift" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.affective_uplift.toFixed(1)}
                        </span>
                      </div>
                      <Progress
                        value={Math.max(
                          0,
                          Math.min(100, analysis.kpi_metrics.affective_uplift)
                        )}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Brand Favorability Rate
                          </p>
                          <MediaMetricInfoTooltip metric="brand favorability rate" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.brand_favorability_rate.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.brand_favorability_rate}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Brand Consideration Uplift
                          </p>
                          <MediaMetricInfoTooltip metric="brand consideration uplift" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.brand_consideration_uplift.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.brand_consideration_uplift}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Brand Trust Index
                          </p>
                          <MediaMetricInfoTooltip metric="brand trust index" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.brand_trust_index.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.brand_trust_index}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Creative Appeal Rate
                          </p>
                          <MediaMetricInfoTooltip metric="creative appeal rate" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.creative_appeal_rate.toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.creative_appeal_rate}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Clarity of Message Rate
                          </p>
                          <MediaMetricInfoTooltip metric="clarity of message rate" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.clarity_of_message_rate.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.clarity_of_message_rate}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Distinctiveness Score Rate
                          </p>
                          <MediaMetricInfoTooltip metric="distinctiveness score rate" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.distinctiveness_score_rate.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.distinctiveness_score_rate}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Simulated Share Intent Rate
                          </p>
                          <MediaMetricInfoTooltip metric="simulated share intent rate" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.simulated_share_intent_rate.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={analysis.kpi_metrics.simulated_share_intent_rate}
                      />
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            NPS (Pre → Post)
                          </p>
                          <MediaMetricInfoTooltip metric="nps" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.pre_exposure_nps.toFixed(1)} →{" "}
                          {analysis.kpi_metrics.post_exposure_nps.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-background rounded-lg border p-3 shadow-sm md:col-span-2">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <p className="text-muted-foreground text-xs">
                            Emotional Valence (Δ)
                          </p>
                          <MediaMetricInfoTooltip metric="emotional valence" />
                        </div>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {analysis.kpi_metrics.change_in_emotional_valence_before.toFixed(
                            1
                          )}{" "}
                          →{" "}
                          {analysis.kpi_metrics.change_in_emotional_valence_after.toFixed(
                            1
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Behavioral Metrics - Moved to top for prominence */}
                {analysis.behavioral_metrics && (
                  <div className="border-primary/20 bg-primary/5 rounded-lg border-2 p-4">
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-bold">
                      <span className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
                        <PieChart2 className="size-[1.2em]" />
                      </span>
                      Behavioral Metrics
                    </h4>

                    {/* Engagement Metrics */}
                    <div className="mb-4">
                      <h5 className="text-primary mb-2 text-sm font-semibold">
                        Engagement & Interaction
                      </h5>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Sentiment
                            </p>
                            <MediaMetricInfoTooltip metric="sentiment" />
                          </div>
                          <p className="text-base font-bold">
                            {analysis.behavioral_metrics.sentiment_label}
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Attention
                            </p>
                            <MediaMetricInfoTooltip metric="attention" />
                          </div>
                          <p className="text-base font-bold">
                            {analysis.behavioral_metrics.attention_seconds}s
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Persona Resonance
                            </p>
                            <MediaMetricInfoTooltip metric="persona resonance" />
                          </div>
                          <p className="text-base font-bold">
                            {analysis.behavioral_metrics.persona_resonance}/100
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Audience Weight
                            </p>
                            <MediaMetricInfoTooltip metric="audience weight" />
                          </div>
                          <p className="text-base font-bold">
                            {(
                              analysis.behavioral_metrics.audience_weight * 100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Conversion Funnel */}
                    <div className="mb-4">
                      <h5 className="text-primary mb-2 text-sm font-semibold">
                        Conversion Funnel
                      </h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Exposure Prob
                            </p>
                            <MediaMetricInfoTooltip metric="exposure prob" />
                          </div>
                          <p className="text-base font-bold">
                            {(
                              analysis.behavioral_metrics.exposure_prob * 100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Click Probability
                            </p>
                            <MediaMetricInfoTooltip metric="click probability" />
                          </div>
                          <p className="text-base font-bold">
                            {(
                              analysis.behavioral_metrics.click_prob * 100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Conversion Prob
                            </p>
                            <MediaMetricInfoTooltip metric="conversion probability" />
                          </div>
                          <p className="text-base font-bold">
                            {(
                              analysis.behavioral_metrics.conversion_prob * 100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Management */}
                    <div>
                      <h5 className="text-primary mb-2 text-sm font-semibold">
                        Campaign Management
                      </h5>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Frequency Cap
                            </p>
                            <MediaMetricInfoTooltip metric="frequency cap" />
                          </div>
                          <p className="text-base font-bold">
                            {analysis.behavioral_metrics.frequency_cap}
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Max Touchpoints
                            </p>
                            <MediaMetricInfoTooltip metric="max touchpoints" />
                          </div>
                          <p className="text-base font-bold">
                            {analysis.behavioral_metrics.max_touchpoints}
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Cooldown Days
                            </p>
                            <MediaMetricInfoTooltip metric="cooldown days" />
                          </div>
                          <p className="text-base font-bold">
                            {analysis.behavioral_metrics.cooldown_days}d
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Memory Half-Life
                            </p>
                            <MediaMetricInfoTooltip metric="memory half-life" />
                          </div>
                          <p className="text-base font-bold">
                            {analysis.behavioral_metrics.memory_half_life_days}d
                          </p>
                        </div>
                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                          <div className="mb-1 flex items-center justify-center gap-1">
                            <p className="text-muted-foreground text-xs">
                              Fatigue Rate
                            </p>
                            <MediaMetricInfoTooltip metric="fatigue rate" />
                          </div>
                          <p className="text-base font-bold">
                            {(
                              analysis.behavioral_metrics.fatigue_rate * 100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Custom Questions & Responses */}
                {analysis.custom_questions_responses &&
                  Object.keys(analysis.custom_questions_responses).length >
                    0 && (
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-semibold">
                        <HelpCircle className="h-5 w-5" />
                        Custom Questions & Responses
                        <Badge variant="secondary" className="ml-1">
                          {
                            Object.keys(analysis.custom_questions_responses)
                              .length
                          }
                        </Badge>
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(
                          analysis.custom_questions_responses
                        ).map(([question, response], index) => (
                          <div key={index} className="space-y-2">
                            <div className="bg-primary/5 border-primary/20 rounded-lg border-l-4 p-3">
                              <div className="flex items-start gap-2">
                                <span className="bg-primary/20 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                                  Q
                                </span>
                                <p className="text-primary flex-1 text-sm leading-relaxed font-semibold">
                                  {question}
                                </p>
                              </div>
                            </div>
                            <div className="bg-muted/50 rounded-lg border p-3">
                              <div className="flex items-start gap-2">
                                <span className="bg-muted-foreground/20 text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                                  A
                                </span>
                                <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                                  {response}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* <Separator /> */}

                <div className="space-y-3">
                  <h4 className="font-semibold">KPI Rates (Chart)</h4>
                  <KPIRatesBarChart kpi={analysis.kpi_metrics} />
                </div>

                <Separator />

                {/* Observed Elements */}
                {analysis.observed_elements && (
                  <div>
                    <h4 className="mb-2 font-semibold">Observed Elements</h4>
                    <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                      {analysis.observed_elements.description}
                    </p>

                    {/* Key Visuals */}
                    {analysis.observed_elements.key_visuals?.length > 0 && (
                      <div className="mb-3">
                        <h5 className="mb-1 text-sm font-medium">
                          Key Visuals
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {analysis.observed_elements.key_visuals.map(
                            (visual, index) => (
                              <Badge key={index} variant="outline">
                                {visual}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Text Content */}
                    {analysis.observed_elements.text_content?.length > 0 && (
                      <div className="mb-3">
                        <h5 className="mb-1 text-sm font-medium">
                          Text Content
                        </h5>
                        <ul className="text-muted-foreground ml-5 list-disc text-sm">
                          {analysis.observed_elements.text_content.map(
                            (text, index) => (
                              <li key={index}>{text}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Notable Moments */}
                    {analysis.observed_elements.notable_moments?.length > 0 && (
                      <div>
                        <h5 className="mb-1 text-sm font-medium">
                          Notable Moments
                        </h5>
                        <ul className="text-muted-foreground ml-5 list-disc text-sm">
                          {analysis.observed_elements.notable_moments.map(
                            (moment, index) => (
                              <li key={index}>{moment}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Fields commented out - will be used later */}
                {/* Executive Summary */}
                {/* <div>
                  <h4 className="mb-2 font-semibold">Executive Summary</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {analysis.executive_summary}
                  </p>
                </div> */}

                {/* Insights Grid */}
                {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2"> */}
                {/* Strengths */}
                {/* <div>
                    <h4 className="mb-2 font-semibold text-green-700">
                      Key Strengths
                    </h4>
                    <ul className="ml-5 list-disc text-sm text-green-600">
                      {analysis.insights.key_strengths.map(
                        (strength, index) => (
                          <li key={index}>{strength}</li>
                        )
                      )}
                    </ul>
                  </div> */}

                {/* Concerns */}
                {/* <div>
                    <h4 className="mb-2 font-semibold text-red-700">
                      Key Concerns
                    </h4>
                    <ul className="list-disc text-sm text-red-600">
                      {analysis.insights.key_concerns.map((concern, index) => (
                        <li key={index}>{concern}</li>
                      ))}
                    </ul>
                  </div>
                </div> */}

                {/* Recommendations */}
                {/* <div>
                  <h4 className="mb-2 font-semibold">Recommendations</h4>
                  <ul className="text-muted-foreground ml-5 list-disc text-sm">
                    {analysis.insights.recommendations.map(
                      (recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      )
                    )}
                  </ul>
                </div> */}

                {/* Alignment Scores */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold">
                      {analysis.persona_resonance}/100
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Persona Alignment
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold">
                      {analysis.product_alignment}/100
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Product Alignment
                    </p>
                  </div>
                </div> */}

                {/* Campaign Suitability */}
                {/* <div>
                  <h4 className="mb-2 font-semibold">Campaign Suitability</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.campaign_suitability.map((campaign, index) => (
                      <Badge key={index} variant="secondary">
                        {campaign}
                      </Badge>
                    ))}
                  </div>
                </div> */}

                {/* Media Info */}
                {mediaFile && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h4 className="mb-2 font-semibold">Media Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>{" "}
                        {mediaFile.media_type}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span>{" "}
                        {formatMediaSize(mediaFile.media_size)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* KPI Rates Bar Chart (Optional) */}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};

export const IndividualAnalysis = ({
  data,
  selectedAnalysisId,
  onAnalysisSelect,
  className,
}: IndividualAnalysisProps) => {
  const [localSelectedId, setLocalSelectedId] = useState<string>(
    selectedAnalysisId || data.individual_analysis?.[0]?.analysis_id || ""
  );

  const handleAnalysisSelect = (analysisId: string) => {
    setLocalSelectedId(analysisId);
    onAnalysisSelect?.(analysisId);
  };

  if (!data.individual_analysis?.length) {
    return (
      <div className={cn("flex h-64 items-center justify-center", className)}>
        <p className="text-muted-foreground">No analysis data available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Individual Media Analysis</h2>
        <Badge variant="outline">
          {data.individual_analysis.length} Analysis
          {data.individual_analysis.length !== 1 ? "es" : ""}
        </Badge>
      </div>

      <div className="space-y-4">
        {data.individual_analysis.map((analysis) => {
          const mediaFile = data.media_files?.find(
            (file) => file.media_id === analysis.media_id
          );
          const personaName = data.participated_personas.find(
            (persona) => persona._id === analysis.persona_id
          )?.name;

          return (
            <AnalysisCard
              key={analysis.analysis_id}
              analysis={analysis}
              mediaFile={mediaFile || ({} as MediaFile)}
              isSelected={localSelectedId === analysis.analysis_id}
              onSelect={() => handleAnalysisSelect(analysis.analysis_id)}
              personaName={personaName || "Unknown Persona"}
            />
          );
        })}
      </div>
    </div>
  );
};
