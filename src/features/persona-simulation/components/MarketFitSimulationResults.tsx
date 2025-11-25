import React from "react";

import { Download, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type {
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
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
const formatDecimal = (value: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
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

const ListSection = ({ title, items }: { title: string; items: string[] }) => {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-muted-foreground mb-1 text-xs uppercase">{title}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((item) => (
          <li key={item}>
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
  <Card>
    <CardHeader className="pb-2">
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
    <CardContent className="space-y-2 text-sm">
      <p className="leading-relaxed font-medium">
        <EmphasizedText text={recommendation.recommendation} />
      </p>
      <p className="text-muted-foreground leading-relaxed">
        <span className="font-semibold">Rationale:</span>{" "}
        <EmphasizedText text={recommendation.rationale} />
      </p>
    </CardContent>
  </Card>
);

const CriticalIssueCard = ({ issue }: { issue: MarketFitCriticalIssue }) => (
  <Card>
    <CardHeader className="space-y-2">
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
      <CardTitle className="text-lg">{issue.title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm leading-relaxed">
      <div>
        <p className="text-muted-foreground text-xs uppercase">Description</p>
        <p>{issue.description}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase">
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
      <div>
        <p className="text-muted-foreground text-xs uppercase">
          Business impact
        </p>
        {issue.business_impact.split("\n").map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase">
          Recommendations
        </p>
        {issue.recommendations.split("\n").map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ProductModificationCard = ({
  item,
}: {
  item: MarketFitProductModification;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{item.modification_area}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm leading-relaxed">
      <div>
        <p className="text-muted-foreground text-xs uppercase">Current state</p>
        <p>{item.current_state}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase">
          Recommended state
        </p>
        <p>{item.recommended_state}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-xs uppercase">Justification</p>
        <p>{item.justification}</p>
      </div>
    </CardContent>
  </Card>
);

const ValuePropRewriteCard = ({
  rewrite,
}: {
  rewrite: MarketFitValuePropRewrite;
}) => (
  <Card>
    <CardHeader className="space-y-3">
      <CardTitle className="text-base">Current Messaging</CardTitle>
      <p className="text-sm leading-relaxed">{rewrite.current_messaging}</p>
    </CardHeader>
    <CardContent className="space-y-4">
      {rewrite.recommendation_by_segment.map((segment) => (
        <div
          key={segment.segment_name}
          className="rounded-lg border border-dashed p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">
              {segment.segment_name} · {segment.primary_hook}
            </h4>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {segment.key_messages_to_add.map((message) => (
              <li key={message}>
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

const kpiDescriptions: Record<string, string> = {
  adoption_rate:
    "Measures the percentage of users who start actively using the product or feature after exposure.",
  churn_probability:
    "Estimates the likelihood that a customer will stop using the product or cancel their subscription.",
  click_through_rate:
    "Tracks the percentage of users who click a link or CTA compared to total impressions.",
  conversion_rate:
    "Measures the percentage of users who complete a desired action, such as a purchase or signup.",
  customer_acquisition_cost:
    "Represents the average cost to acquire a new customer from marketing and sales spend.",
  interest_level:
    "Indicates overall user interest or engagement based on behavior or survey feedback.",
  pmf_index:
    "Shows how well the product satisfies its market, driven by “must-have” signals.",
  price_perception:
    "Reflects whether users feel the pricing is fair, expensive, or affordable relative to value.",
  problem_solution_fit:
    "Reveals how effectively the product solves core user pain points.",
  purchase_intent:
    "Signals the likelihood that users will buy the product in the near future.",
  retention_intent:
    "Measures how likely existing customers are to continue using or renewing the product.",
  retention_rate:
    "Captures the percentage of customers who remain active over a specific period.",
  satisfaction:
    "Summarizes users’ overall satisfaction scores or feedback sentiment.",
  trial_to_adoption:
    "Shows how many trial users convert into active or paying customers.",
  usability:
    "Assesses the ease and intuitiveness of completing key tasks without friction.",
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
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-2 text-[11px]">
          <div>
            <p className="text-foreground text-sm font-semibold">
              {formatDecimal(kpi.min_response * 100)}
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
              {formatDecimal(kpi.max_response * 100)}
            </p>
            <p className="text-muted-foreground uppercase">Max</p>
          </div>
        </div>
        {/* <p className="text-muted-foreground text-xs">
          {kpi.num_responses} responses analyzed
        </p> */}
      </CardContent>
    </Card>
  );
};

export const MarketFitSimulationResults = ({
  data,
  onRestart,
}: MarketFitSimulationResultsProps) => {
  const { simulation_analysis, recommendation, s3_keys } = data;
  const { metadata, kpi_summary } = simulation_analysis;

  const exportResults = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `market-fit-simulation-${metadata.generated_at}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted-foreground text-sm tracking-wide uppercase">
            Market Fit Simulation
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
          <Button size="sm" onClick={exportResults}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kpi-summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kpi-summary">KPI Summary</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="kpi-summary" className="space-y-4">
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
            {kpi_summary.map((kpi) => (
              <KpiGaugeCard key={kpi.kpi_metric} kpi={kpi} />
            ))}
          </div>
          <AttachmentList attachments={s3_keys} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <section className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Segment Analysis</p>
              <p className="text-muted-foreground text-sm">
                Deep dive into top personas, blockers, and activation paths.
              </p>
            </div>
            <div className="space-y-4">
              {recommendation.segment_analysis.map(
                (segment: MarketFitSegmentAnalysis) => (
                  <Card key={segment.segment_name}>
                    <CardHeader className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-xl">
                            {segment.segment_name}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            {segment.segment_size}
                          </p>
                        </div>
                        <Badge variant="outline">{segment.fit_level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5 text-sm leading-relaxed">
                      <div className="grid gap-4 md:grid-cols-3">
                        <ListSection
                          title="Demographics"
                          items={segment.key_characteristics.demographics}
                        />
                        <ListSection
                          title="Behaviors"
                          items={segment.key_characteristics.behaviors}
                        />
                        <ListSection
                          title="Pain points"
                          items={segment.key_characteristics.pain_points}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <ListSection
                          title="Strengths"
                          items={segment.strengths}
                        />
                        <ListSection
                          title="Weaknesses"
                          items={segment.weaknesses}
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">
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
                      <div>
                        <p className="text-sm font-semibold">
                          Acquisition channels
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {segment.acquisition_channels.map((channel) => (
                            <Badge key={channel} variant="outline">
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

          <section className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Critical Issues</p>
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

          <section className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Product & Experience</p>
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

          <section className="space-y-3">
            <div>
              <p className="text-sm font-semibold">Value Proposition</p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
