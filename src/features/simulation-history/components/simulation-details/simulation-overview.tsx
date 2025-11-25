import { QuestionCircle } from "@solar-icons/react-perf/BoldDuotone";
import { Package, Users } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

import { ContextLayerDisplay } from "@/components/shared/context-layer-display";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import type { SimulationDetails } from "../../types/simulation.types";
import {
  calculateProgress,
  getInterestLevelColor,
  getPricePerceptionColor,
  getPurchaseIntentColor,
} from "../../utils/simulation.utils";

interface SimulationOverviewProps {
  simulation: SimulationDetails;
}

const chartConfig = {
  pmf: { label: "PMF", color: "var(--chart-1)" },
  tta: {
    label: "Trial→Adoption",
    color: "var(--chart-2)",
  },
  valueClarity: {
    label: "Value Clarity",
    color: "var(--chart-3)",
  },
  psf: {
    label: "Problem-Solution Fit",
    color: "var(--chart-4)",
  },
  affinity: {
    label: "Affinity Match",
    color: "var(--chart-5)",
  },
  usability: {
    label: "Usability",
    color: "var(--chart-6)",
  },
  satisfaction: {
    label: "Satisfaction",
    color: "var(--chart-7)",
  },
  adoption: {
    label: "Adoption",
    color: "var(--chart-8)",
  },
  churn: {
    label: "Churn",
    color: "var(--chart-9)",
  },
  retention: {
    label: "Retention",
    color: "var(--chart-10)",
  },
} satisfies ChartConfig;

export const SimulationOverview = ({ simulation }: SimulationOverviewProps) => {
  const overallData = [
    {
      key: "pmf",
      label: "PMF",
      value: simulation.summary.overall_pmf_score,
      fill: "var(--color-pmf)",
    },
    {
      key: "tta",
      label: "Trial→Adoption",
      value: simulation.summary.overall_trial_to_adoption_score,
      fill: "var(--color-tta)",
    },
    {
      key: "valueClarity",
      label: "Value Clarity",
      value: simulation.summary.overall_value_proposition_clarity_score,
      fill: "var(--color-valueClarity)",
    },
    {
      key: "psf",
      label: "Problem-Solution Fit",
      value: simulation.summary.overall_problem_solution_fit_score,
      fill: "var(--color-psf)",
    },
    {
      key: "affinity",
      label: "Affinity Match",
      value: simulation.summary.overall_affinity_cluster_match_score,
      fill: "var(--color-affinity)",
    },
    {
      key: "usability",
      label: "Usability",
      value: simulation.summary.overall_usability_score,
      fill: "var(--color-usability)",
    },
    {
      key: "satisfaction",
      label: "Satisfaction",
      value: simulation.summary.overall_satisfaction_score,
      fill: "var(--color-satisfaction)",
    },
    {
      key: "adoption",
      label: "Adoption",
      value: simulation.summary.overall_adoption_rate,
      fill: "var(--color-adoption)",
    },
    {
      key: "churn",
      label: "Churn",
      value: simulation.summary.overall_churn_probability,
      fill: "var(--color-churn)",
    },
    {
      key: "retention",
      label: "Retention",
      value: simulation.summary.overall_retention_intent,
      fill: "var(--color-retention)",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Overall Summary Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Overall Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Metrics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Overall Interest Level
                </span>
                <span
                  className={`text-sm font-semibold ${getInterestLevelColor(simulation.summary.overall_interest_level)}`}
                >
                  ({simulation.summary.overall_interest_level}/10)
                </span>
              </div>
              <Progress
                value={calculateProgress(
                  simulation.summary.overall_interest_level
                )}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Overall Purchase Intent
                </span>
                <span
                  className={`text-sm font-semibold ${getPurchaseIntentColor(simulation.summary.overall_purchase_intent)}`}
                >
                  ({simulation.summary.overall_purchase_intent}/10)
                </span>
              </div>
              <Progress
                value={calculateProgress(
                  simulation.summary.overall_purchase_intent
                )}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Overall Price Perception</p>
              <Badge
                variant="outline"
                className={getPricePerceptionColor(
                  simulation.summary.overall_price_perception
                )}
              >
                {simulation.summary.overall_price_perception}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">PMF Index</span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_pmf_index.toFixed(1)}
                </span>
              </div>
              <Progress
                value={Math.min(
                  100,
                  (simulation.summary.overall_pmf_index / 10) * 100
                )}
                className="h-2"
              />
            </div>
          </div>

          {/* Key Scores (Percentages) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">PMF Score</span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_pmf_score}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_pmf_score}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Trial to Adoption</span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_trial_to_adoption_score}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_trial_to_adoption_score}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Value Proposition Clarity
                </span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_value_proposition_clarity_score}%
                </span>
              </div>
              <Progress
                value={
                  simulation.summary.overall_value_proposition_clarity_score
                }
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Problem-Solution Fit
                </span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_problem_solution_fit_score}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_problem_solution_fit_score}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Affinity Cluster Match
                </span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_affinity_cluster_match_score}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_affinity_cluster_match_score}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usability</span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_usability_score}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_usability_score}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Satisfaction</span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_satisfaction_score}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_satisfaction_score}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Adoption Rate</span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_adoption_rate}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_adoption_rate}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Churn Probability</span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_churn_probability}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_churn_probability}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Retention Intent</span>
                <span className="text-sm font-semibold">
                  {simulation.summary.overall_retention_intent}%
                </span>
              </div>
              <Progress
                value={simulation.summary.overall_retention_intent}
                className="h-2"
              />
            </div>
          </div>

          {/* Visualization: Overall Score Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium">Overall Score Breakdown</h4>
            {(() => {
              return (
                <ChartContainer config={chartConfig} className="w-full">
                  <BarChart
                    accessibilityLayer
                    data={overallData}
                    layout="vertical"
                    margin={{ left: -20, right: 8, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      dataKey="label"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={120}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                      formatter={(value, _name, item) => {
                        const v =
                          typeof value === "number" ? value.toFixed(1) : value;
                        return (
                          <div className="flex w-full items-center justify-between gap-4">
                            <span className="text-muted-foreground">
                              {item?.payload?.label}
                            </span>
                            <span>{v}%</span>
                          </div>
                        );
                      }}
                      // nameKey="label"
                    />
                    <Bar
                      dataKey="value"
                      radius={4}
                      activeBar={<Rectangle fillOpacity={0.8} />}
                    >
                      {overallData.map((d, i) => (
                        <Cell key={`cell-${d.key}-${i}`} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              );
            })()}
          </div>
          {/* Summary and Insights */}
          {/* {(simulation.summary.overall_summary ||
            simulation.summary.overall_recommendation ||
            simulation.summary.reason_to_reject) && (
            <div className="space-y-4">
              {simulation.summary.overall_summary && (
                <div className="space-y-2">
                  <h4 className="font-medium">Overall Summary</h4>
                  <p className="text-muted-foreground">
                    {simulation.summary.overall_summary}
                  </p>
                </div>
              )}
              {simulation.summary.overall_recommendation && (
                <div className="space-y-2">
                  <h4 className="font-medium">Overall Recommendation</h4>
                  <p className="text-muted-foreground">
                    {simulation.summary.overall_recommendation}
                  </p>
                </div>
              )}
              {simulation.summary.reason_to_reject && (
                <div className="space-y-2">
                  <h4 className="font-medium">Reason to Reject</h4>
                  <p className="text-muted-foreground">
                    {simulation.summary.reason_to_reject}
                  </p>
                </div>
              )}
            </div>
          )} */}

          {/* Key Concerns */}
          {/* {simulation.summary.key_concerns &&
            simulation.summary.key_concerns.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Key Concerns</h4>
                <div className="flex flex-wrap gap-2">
                  {simulation.summary.key_concerns.map((concern, idx) => (
                    <Badge key={idx} variant="destructive" className="text-xs">
                      {concern}
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}

          {/* Best Fit Personas */}
          {/* {simulation.summary.best_fit_personas &&
            simulation.summary.best_fit_personas.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Best Fit Personas</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {simulation.summary.best_fit_personas.map((p) => (
                    <div
                      key={p.persona_id}
                      className="space-y-1 rounded-lg border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{p.persona_name}</span>
                        <Badge variant="outline">Best Fit</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {p.reason}
                      </p>
                      {p.other_insights && p.other_insights.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {p.other_insights.map((insight, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {insight}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )} */}
        </CardContent>
      </Card>

      <Separator />

      <ContextLayerDisplay
        contextLayer={simulation.context_layer}
        title="Context Layer"
        showEmpty={true}
      />
      <Separator />

      {simulation.summary.custom_questions_responses && (
        <Card className="bg-secondary/50 border-secondary">
          <div className="p-6">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <QuestionCircle className="h-5 w-5" />
              Custom Questions
            </h3>

            <div className="space-y-6">
              {Object.entries(
                simulation.summary.custom_questions_responses
              ).map(([question, response], index) => (
                <div
                  key={question}
                  className="border-border/50 border-b pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3">
                      <h4 className="text-foreground leading-relaxed font-medium">
                        {question}
                      </h4>
                      <div className="text-muted-foreground border-primary/20 border-l-2 pl-4 text-sm leading-relaxed">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{response}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Personas Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tested Personas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {simulation.personas.map((persona) => (
              <div
                key={persona._id}
                className="bg-muted/50 space-y-2 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{persona.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {persona.persona_category}
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {persona.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
