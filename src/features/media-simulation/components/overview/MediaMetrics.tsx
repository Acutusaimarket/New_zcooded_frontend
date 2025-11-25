import { PieChart2 } from "@solar-icons/react-perf/BoldDuotone";
import { FileText, Image, Music, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { SCORE_COLORS } from "../../constants/chart-colors";
import { getScoreCategory } from "../../constants/performance-thresholds";
import type { MediaSimulationData } from "../../types/media-simulation.types";
import { formatMediaSize } from "../../utils/data-formatters";
import { MediaMetricInfoTooltip } from "../media-metric-info-tooltip";

interface MediaMetricsProps {
  data: MediaSimulationData;
  className?: string;
}

const getMediaTypeIcon = (mediaType: string) => {
  switch (mediaType.toLowerCase()) {
    case "image/png":
    case "image/jpeg":
    case "image/jpg":
    case "image/gif":
      return Image;
    case "video/mp4":
    case "video/avi":
    case "video/mov":
      return Video;
    case "audio/mp3":
    case "audio/wav":
      return Music;
    default:
      return FileText;
  }
};
const getScoreColor = (score: number, maxScore: number = 100) => {
  const category = getScoreCategory(score, maxScore);
  return SCORE_COLORS[category];
};
export const MediaMetrics = ({ data, className }: MediaMetricsProps) => {
  const mediaAnalyses = data.individual_analysis || [];
  const personas = data.participated_personas;

  return (
    <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-2", className)}>
      {mediaAnalyses.map((analysis) => {
        const mediaFile = data.media_files?.find(
          (file) => file.media_id === analysis.media_id
        );

        const personaName = personas.find(
          (persona) => persona._id === analysis.persona_id
        )?.name;

        return (
          <Card key={analysis.analysis_id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {(() => {
                    const Icon = getMediaTypeIcon(mediaFile?.media_type || "");
                    return <Icon className="h-5 w-5" />;
                  })()}
                  Media Analysis
                </CardTitle>
                <Badge variant="outline">
                  {analysis.analysis_id.substring(0, 8)}
                </Badge>
              </div>
              {mediaFile && (
                <div className="text-muted-foreground text-sm">
                  <p className="font-medium">
                    {mediaFile.media_id.replace(/_[0-9a-fA-F-]{36}$/, "")} v/s{" "}
                    {personaName}
                  </p>
                  <p>{formatMediaSize(mediaFile.media_size)}</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Effectiveness */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Overall Effectiveness
                  </span>
                  <span className="text-sm font-bold">
                    {analysis.kpi_metrics.overall_effectiveness}/100
                  </span>
                </div>
                <Progress
                  value={analysis.kpi_metrics.overall_effectiveness}
                  className="h-2"
                />
                <Badge
                  variant={
                    analysis.kpi_metrics.overall_effectiveness >= 80
                      ? "default"
                      : analysis.kpi_metrics.overall_effectiveness >= 60
                        ? "secondary"
                        : analysis.kpi_metrics.overall_effectiveness >= 40
                          ? "outline"
                          : "destructive"
                  }
                >
                  {getScoreCategory(
                    analysis.kpi_metrics.overall_effectiveness,
                    100
                  )}
                </Badge>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground text-xs">Engagement</p>
                    <MediaMetricInfoTooltip metric="engagement" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: getScoreColor(
                          analysis.kpi_metrics.engagement_potential
                        ),
                      }}
                    />
                    <span className="text-sm font-medium">
                      {analysis.kpi_metrics.engagement_potential.toFixed(1)}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground text-xs">Clarity</p>
                    <MediaMetricInfoTooltip metric="clarity" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: getScoreColor(
                          analysis.kpi_metrics.message_clarity
                        ),
                      }}
                    />
                    <span className="text-sm font-medium">
                      {analysis.kpi_metrics.message_clarity.toFixed(1)}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground text-xs">
                      Brand Consistency
                    </p>
                    <MediaMetricInfoTooltip metric="brand consistency" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: getScoreColor(
                          analysis.kpi_metrics.brand_consistency
                        ),
                      }}
                    />
                    <span className="text-sm font-medium">
                      {analysis.kpi_metrics.brand_consistency.toFixed(1)}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground text-xs">Conversion</p>
                    <MediaMetricInfoTooltip metric="conversion" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: getScoreColor(
                          analysis.kpi_metrics.conversion_potential
                        ),
                      }}
                    />
                    <span className="text-sm font-medium">
                      {analysis.kpi_metrics.conversion_potential.toFixed(1)}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Behavioral Metrics - Minimal View */}
              {analysis.behavioral_metrics && (
                <div className="border-t pt-3">
                  <h4 className="mb-2 flex items-center gap-1 text-xs font-semibold">
                    <span className="text-xs">
                      <PieChart2 className="size-[1.2em]" />
                    </span>
                    Key Behavioral Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-xs font-bold">
                          {analysis.behavioral_metrics.sentiment_label}
                        </p>
                        <MediaMetricInfoTooltip metric="sentiment" />
                      </div>
                      <p className="text-muted-foreground text-[10px]">
                        Sentiment
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-xs font-bold">
                          {(
                            analysis.behavioral_metrics.click_prob * 100
                          ).toFixed(1)}
                          %
                        </p>
                        <MediaMetricInfoTooltip metric="click" />
                      </div>
                      <p className="text-muted-foreground text-[10px]">Click</p>
                    </div>
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-xs font-bold">
                          {(
                            analysis.behavioral_metrics.conversion_prob * 100
                          ).toFixed(1)}
                          %
                        </p>
                        <MediaMetricInfoTooltip metric="conversion prob" />
                      </div>
                      <p className="text-muted-foreground text-[10px]">Conv.</p>
                    </div>
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-xs font-bold">
                          {analysis.behavioral_metrics.attention_seconds}s
                        </p>
                        <MediaMetricInfoTooltip metric="attention" />
                      </div>
                      <p className="text-muted-foreground text-[10px]">
                        Attention
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-xs font-bold">
                          {analysis.behavioral_metrics.persona_resonance}/100
                        </p>
                        <MediaMetricInfoTooltip metric="persona resonance" />
                      </div>
                      <p className="text-muted-foreground text-[10px]">
                        Resonance
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded p-2 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1">
                        <p className="text-xs font-bold">
                          {(
                            analysis.behavioral_metrics.audience_weight * 100
                          ).toFixed(0)}
                          %
                        </p>
                        <MediaMetricInfoTooltip metric="audience weight" />
                      </div>
                      <p className="text-muted-foreground text-[10px]">
                        Audience
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Persona & Product Alignment - Commented out as these fields will be used later */}
              {/* <div className="grid grid-cols-2 gap-3 border-t pt-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">
                    Persona Alignment
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={analysis.persona_resonance}
                      className="h-1 flex-1"
                    />
                    <span className="text-xs font-medium">
                      {analysis.persona_resonance}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">
                    Product Alignment
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={analysis.product_alignment}
                      className="h-1 flex-1"
                    />
                    <span className="text-xs font-medium">
                      {analysis.product_alignment}/100
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Top Strength & Concern - Commented out as insights field will be used later */}
              {/* <div className="space-y-2 border-t pt-2">
                {analysis?.insights?.key_strengths?.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">
                      Top Strength
                    </p>
                    <ul className="ml-5 list-disc text-green-600">
                      {analysis.insights.key_strengths.map((strength) => (
                        <li key={strength}>
                          <span className="line-clamp-2 text-xs">
                            {strength}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis?.insights?.key_concerns?.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs">
                      Main Concern
                    </p>
                    <ul className="ml-5 list-disc text-red-600">
                      {analysis.insights.key_concerns.map((concern) => (
                        <li key={concern}>
                          <span className="line-clamp-2 text-xs">
                            {concern}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
