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

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDecimal = (value: number | null) => {
  if (value === null || typeof value !== "number" || Number.isNaN(value))
    return "—";
  const fraction = Math.abs(value % 1);
  return fraction === 0 ? value.toFixed(0) : value.toFixed(2);
};

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

const getScoreVisuals = (value: number, kpiMetric?: string) => {
  // Always green for Ad Frequency and ROAS
  const metricLower = kpiMetric?.toLowerCase() || "";
  if (metricLower === "ad_frequency" || metricLower === "roas") {
    return { colorHex: "#16a34a", textClass: "text-emerald-600" };
  }

  if (value <= 30) {
    return { colorHex: "#dc2626", textClass: "text-red-600" };
  }
  if (value <= 75) {
    return { colorHex: "#f97316", textClass: "text-orange-500" };
  }
  return { colorHex: "#16a34a", textClass: "text-emerald-600" };
};

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

  const minValue =
    kpi.min_response !== null
      ? kpi.min_response <= 1 && kpi.min_response >= 0
        ? kpi.min_response * 100
        : kpi.min_response
      : null;
  const maxValue =
    kpi.max_response !== null
      ? kpi.max_response <= 1 && kpi.max_response >= 0
        ? kpi.max_response * 100
        : kpi.max_response
      : null;

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
          <p className="text-base font-semibold">{titleCase(kpi.kpi_metric)}</p>
          <p className="text-muted-foreground text-xs">{kpi.metric_type}</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-2 text-[11px]">
          <div>
            <p className="text-foreground text-sm font-semibold">
              {formatDecimal(minValue)}
            </p>
            <p className="text-muted-foreground uppercase">Min</p>
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {percentage}
            </p>
            <p className="text-muted-foreground uppercase">Avg</p>
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {formatDecimal(maxValue)}
            </p>
            <p className="text-muted-foreground uppercase">Max</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RoasCard = ({
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
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-center space-y-3 px-3 py-4 text-center">
        <div className="relative flex h-20 w-24 items-center justify-center">
          <SemiCircleGauge
            percentage={percentage}
            accentColor={visuals.colorHex}
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className={`text-2xl font-bold ${visuals.textClass}`}>
              {kpi.formatted_roas || percentage}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold">{titleCase(kpi.kpi_metric)}</p>
          <p className="text-muted-foreground text-xs">{kpi.metric_type}</p>
        </div>
        <div className="w-full text-center">
          <p className="text-foreground text-sm font-semibold">
            {kpi.formatted_roas || formatDecimal(kpi.average_response)}
          </p>
          <p className="text-muted-foreground text-[11px] uppercase">Value</p>
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
  <Card>
    <CardHeader className="space-y-2">
      <CardTitle className="text-lg">{modification.modification_area}</CardTitle>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">Modification</Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4 text-sm leading-relaxed">
      <div>
        <p className="text-muted-foreground mb-1 text-xs uppercase">
          Current State
        </p>
        <p>{modification.current_state}</p>
      </div>
      <div>
        <p className="text-muted-foreground mb-1 text-xs uppercase">
          Recommended State
        </p>
        <p>{modification.recommended_state}</p>
      </div>

      {modification.expected_impact && modification.expected_impact.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-2 text-xs uppercase">
            Expected Impact
          </p>
          <div className="space-y-2">
            {modification.expected_impact.map((impact: { metric_name: string; expected_change: string; confidence_level: string }, index: number) => (
              <div
                key={index}
                className="rounded-md border border-dashed p-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{impact.metric_name}</span>
                  <Badge variant="outline">{impact.confidence_level}</Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Expected change: {impact.expected_change}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {modification.specific_changes && (
        <div className="space-y-3">
          <p className="text-muted-foreground mb-2 text-xs uppercase">
            Specific Changes
          </p>

          {modification.specific_changes.visuals && (
            <div className="space-y-2">
              {modification.specific_changes.visuals.add &&
                modification.specific_changes.visuals.add.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-green-600">
                      Add:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-xs">
                      {modification.specific_changes.visuals.add.map(
                        (item: string, idx: number) => (
                          <li key={idx}>
                            <EmphasizedText text={item} />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              {modification.specific_changes.visuals.remove &&
                modification.specific_changes.visuals.remove.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-red-600">
                      Remove:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-xs">
                      {modification.specific_changes.visuals.remove.map(
                        (item: string, idx: number) => (
                          <li key={idx}>
                            <EmphasizedText text={item} />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              {modification.specific_changes.visuals.modify &&
                modification.specific_changes.visuals.modify.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-blue-600">
                      Modify:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-xs">
                      {modification.specific_changes.visuals.modify.map(
                        (item: string, idx: number) => (
                          <li key={idx}>
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
            <div className="rounded-md border border-dashed p-3">
              <p className="mb-2 text-xs font-semibold">Script Rewrite</p>
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
              {modification.specific_changes.script_rewrite.recommended_hook && (
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
            <div className="rounded-md border border-dashed p-3">
              <p className="mb-2 text-xs font-semibold">Audio Modifications</p>
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
      generateMediaSimulationPDF(data);
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
            Media Simulation
          </p>
          <h2 className="text-2xl font-bold">KPI & Recommendations Summary</h2>
          <p className="text-muted-foreground text-sm">
            Generated {formatDateTime(metadata.generated_at)} —{" "}
            {metadata.total_responses} responses processed
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
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
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
            {kpi_summary
              .filter(
                (kpi) =>
                  kpi.kpi_metric.toLowerCase() === "roas" ||
                  kpi.metric_type.toLowerCase() !== "calculated"
              )
              .map((kpi) =>
                kpi.kpi_metric.toLowerCase() === "roas" ? (
                  <RoasCard key={kpi.kpi_metric} kpi={kpi} />
                ) : (
                  <KpiGaugeCard key={kpi.kpi_metric} kpi={kpi} />
                )
              )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {recommendation?.media_file_modifications &&
          recommendation.media_file_modifications.length > 0 ? (
            <section className="space-y-3">
              <div>
                <p className="text-sm font-semibold">Media File Modifications</p>
                <p className="text-muted-foreground text-sm">
                  Recommendations for improving your media content.
                </p>
              </div>
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
              <CardContent className="py-8 text-center text-muted-foreground">
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
                    {recommendation.alternative_strategy.scenario || "Alternative Strategy"}
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
                          text={recommendation.alternative_strategy.recommendation}
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
                          text={recommendation.alternative_strategy.justification}
                        />
                      </p>
                    </div>
                  )}
                  {recommendation.alternative_strategy.targeting_refinements && (
                    <div>
                      <p className="text-muted-foreground mb-2 text-xs uppercase">
                        Targeting Refinements
                      </p>
                      {recommendation.alternative_strategy.targeting_refinements
                        .negative_audience_exclusions &&
                        recommendation.alternative_strategy.targeting_refinements
                          .negative_audience_exclusions.length > 0 && (
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
                    <CardContent className="text-sm leading-relaxed text-muted-foreground">
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

