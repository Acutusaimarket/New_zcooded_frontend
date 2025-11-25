import { AlertTriangle, DollarSign, Heart, Target, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";

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
import { TooltipWrapper } from "@/components/ui/tooltip";

import type {
  PersonaResult,
  SimulationDetails,
} from "../../types/simulation.types";
import { getPricePerceptionColor } from "../../utils/simulation.utils";

interface PersonaResultsProps {
  simulation: SimulationDetails;
}

export const PersonaResults = ({ simulation }: PersonaResultsProps) => {
  const formatTwoDecimals = (n: number) =>
    Number.isFinite(n) ? Number(n.toFixed(2)) : n;
  const formatPercent = (n: number) => `${formatTwoDecimals(n)}%`;
  const formatScore10 = (n: number) => `(${formatTwoDecimals(n)}/10)`;
  return (
    <div className="space-y-6">
      {/* Individual Persona Results */}
      <div className="space-y-6">
        {simulation.persona_results.map((result, index) => {
          const persona = simulation.personas.find(
            (p) => p._id === result.persona_id
          );

          return (
            <Card key={result.persona_id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Users className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {persona?.name || `Persona ${index + 1}`}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {persona?.description}
                      </p>
                    </div>
                  </div>
                  {/* <Badge variant="outline" className="text-sm">
                    {persona?.persona_category}
                  </Badge> */}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {/* Interest Level */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">
                        Interest Level
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatScore10(result.result.interest_level)}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Avg rating on 1–10 scale
                    </p>
                  </div>

                  {/* Purchase Intent */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">
                        Purchase Intent
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatScore10(result.result.purchase_intent)}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Likelihood to buy (1–10)
                    </p>
                  </div>

                  {/* Price Perception */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">
                        Price Perception
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 text-sm ${getPricePerceptionColor(result.result.price_perception)}`}
                    >
                      {result.result.price_perception}
                    </Badge>
                    <p className="text-muted-foreground text-xs">
                      Too high/low vs. value
                    </p>
                  </div>

                  {/* PMF Index */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">PMF Index</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {result.result.pmf_index.toFixed(1)}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Composite fit (0–10)
                    </p>
                  </div>
                </div>

                {/* <div className="border-t" /> */}
                <Separator />

                {/* Middle Section: Percentages + KPI Bars */}
                <div>
                  {/* Percentages */}
                  <div>
                    <div className="space-y-4">
                      {/* grid 1 */}
                      <Card className="bg-secondary text-secondary-foreground grid grid-cols-1 gap-4 p-4 sm:grid-cols-4">
                        <h5 className="text-muted-foreground col-span-full text-xs font-semibold tracking-wide">
                          Core Fit Metrics
                        </h5>
                        <div className="space-y-1">
                          <TooltipWrapper content="NPS = %Promoters - %Detractors. Measures advocacy potential.">
                            <span className="text-muted-foreground text-sm">
                              Net Promoter Score
                            </span>
                          </TooltipWrapper>
                          <div className="text-lg font-semibold">
                            {formatPercent(result.result.net_promoter_score)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Higher is better (50+ excellent)
                          </div>
                        </div>
                        <div className="space-y-1">
                          <TooltipWrapper content="PMF Score (Sean Ellis): % of users very disappointed if product went away.">
                            <span className="text-muted-foreground text-sm">
                              PMF Score
                            </span>
                          </TooltipWrapper>
                          <div className="text-lg font-semibold">
                            {formatPercent(result.result.pmf_score)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            30% early signal, 40% strong
                          </div>
                        </div>
                        <div className="space-y-1">
                          <TooltipWrapper content="% of users intending to continue using or repurchase.">
                            <span className="text-muted-foreground text-sm">
                              Retention Intent
                            </span>
                          </TooltipWrapper>
                          <div className="text-lg font-semibold">
                            {formatPercent(result.result.retention_intent)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Higher is better (70%+ great)
                          </div>
                        </div>
                        <div className="space-y-1">
                          <TooltipWrapper content="% of users likely to stop using the product (lower is better).">
                            <span className="text-muted-foreground text-sm">
                              Churn Probability
                            </span>
                          </TooltipWrapper>
                          <div className="text-lg font-semibold">
                            {formatPercent(result.result.churn_probability)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Lower is better (&lt;10% world-class)
                          </div>
                        </div>
                        <div className="space-y-1">
                          <TooltipWrapper content="% of the target segment likely to adopt.">
                            <span className="text-muted-foreground text-sm">
                              Adoption Rate
                            </span>
                          </TooltipWrapper>
                          <div className="text-lg font-semibold">
                            {formatPercent(result.result.adoption_rate)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            Higher is better (35%+ strong)
                          </div>
                        </div>
                      </Card>
                      {/* grid 2 */}
                      <Card className="bg-secondary text-secondary-foreground grid grid-cols-1 gap-4 p-4 sm:grid-cols-4">
                        <h5 className="text-muted-foreground col-span-full pt-2 text-xs font-semibold tracking-wide">
                          Experience & Value
                        </h5>
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-sm">
                            Satisfaction Score
                          </span>
                          <div className="text-lg font-semibold">
                            {formatPercent(result.result.satisfaction_score)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-sm">
                            Usability Score
                          </span>
                          <div className="text-lg font-semibold">
                            {formatPercent(result.result.usability_score)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <TooltipWrapper content="% of users who clearly understand the offering.">
                            <span className="text-muted-foreground text-sm">
                              Value Proposition Clarity
                            </span>
                          </TooltipWrapper>
                          <div className="text-lg font-semibold">
                            {formatPercent(
                              result.result.value_proposition_clarity_score
                            )}
                          </div>
                        </div>
                      </Card>

                      {/* grid 3 */}
                      <Card className="bg-secondary text-secondary-foreground grid grid-cols-1 gap-4 p-4 sm:grid-cols-4">
                        <h5 className="text-muted-foreground col-span-full pt-2 text-xs font-semibold tracking-wide">
                          Fit Indicators
                        </h5>
                        <div className="space-y-1">
                          <TooltipWrapper content="% agreeing the product solves a key problem.">
                            <span className="text-muted-foreground text-sm">
                              Problem-Solution Fit
                            </span>
                          </TooltipWrapper>
                          <div className="text-lg font-semibold">
                            {formatPercent(
                              result.result.problem_solution_fit_score
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-sm">
                            Trial to Adoption
                          </span>
                          <div className="text-lg font-semibold">
                            {formatPercent(
                              result.result.trial_to_adoption_score
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <TooltipWrapper content="% of personas aligning with intended positioning.">
                            <span className="text-muted-foreground text-sm">
                              Affinity Cluster Match
                            </span>
                          </TooltipWrapper>
                          <div className="text-lg font-semibold">
                            {formatPercent(
                              result.result.affinity_cluster_match_score
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* KPI Quick Glance */}
                  <Card className="bg-secondary text-secondary-foreground mt-3 flex flex-col gap-4 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">NPS</span>
                        <span className="font-medium">
                          {formatPercent(result.result.net_promoter_score)}
                        </span>
                      </div>
                      <Progress
                        value={result.result.net_promoter_score}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">PMF</span>
                        <span className="font-medium">
                          {formatPercent(result.result.pmf_score)}
                        </span>
                      </div>
                      <Progress
                        value={result.result.pmf_score}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Retention</span>
                        <span className="font-medium">
                          {formatPercent(result.result.retention_intent)}
                        </span>
                      </div>
                      <Progress
                        value={result.result.retention_intent}
                        className="h-2"
                      />
                    </div>
                  </Card>
                </div>

                {/* <div className="border-t" /> */}
                <Separator />
                {/* Additional Indicators */}
                <Card className="bg-secondary text-secondary-foreground grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Very Disappointed Responses
                    </span>
                    <div className="text-lg font-semibold">
                      {formatTwoDecimals(
                        result.result.very_disappointed_responses
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Intending to Stay
                    </span>
                    <div className="text-lg font-semibold">
                      {formatTwoDecimals(result.result.intending_to_stay)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Predicted Drop
                    </span>
                    <div className="text-lg font-semibold">
                      {formatTwoDecimals(result.result.predicted_drop)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Users Likely to Adopt
                    </span>
                    <div className="text-lg font-semibold">
                      {formatTwoDecimals(result.result.users_likely_to_adopt)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Satisfaction
                    </span>
                    <div className="text-lg font-semibold">
                      {formatTwoDecimals(result.result.satisfaction)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Ease of Use
                    </span>
                    <div className="text-lg font-semibold">
                      {formatTwoDecimals(result.result.ease_of_use)}
                    </div>
                  </div>
                </Card>

                {/* Visualization: Percentage Scores Bar Chart */}
                <PersonaResultsChart result={result.result} />

                {/* Key Concerns */}
                {result.result.key_concerns &&
                  result.result.key_concerns.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">
                          Key Concerns
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.result.key_concerns.map(
                          (concern, concernIndex) => (
                            <Badge
                              key={concernIndex}
                              variant="destructive"
                              className="text-xs"
                            >
                              {concern}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Motivation Drivers */}
                {result.result.motivation_drivers &&
                  result.result.motivation_drivers.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">
                          Motivation Drivers
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.result.motivation_drivers.map(
                          (driver, driverIndex) => (
                            <Badge
                              key={driverIndex}
                              variant="default"
                              className="text-xs"
                            >
                              {driver}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Summary */}
                {result.result.summary && (
                  <div className="space-y-3">
                    <span className="text-sm font-medium">
                      AI Analysis Summary
                    </span>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm leading-relaxed">
                        {result.result.summary}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const chartConfig = {
  nps: { label: "NPS", color: "var(--chart-1)" },
  pmf: { label: "PMF", color: "var(--chart-2)" },
  retention: {
    label: "Retention",
    color: "var(--chart-3)",
  },
  churn: {
    label: "Churn",
    color: "var(--chart-4)",
  },
  adoption: {
    label: "Adoption",
    color: "var(--chart-5)",
  },
  satisfaction: {
    label: "Satisfaction",
    color: "var(--chart-6)",
  },
  usability: {
    label: "Usability",
    color: "var(--chart-7)",
  },
  valueClarity: {
    label: "Value Clarity",
    color: "var(--chart-8)",
  },
  psf: {
    label: "Problem-Solution Fit",
    color: "var(--chart-9)",
  },
  tta: {
    label: "Trial→Adoption",
    color: "var(--chart-10)",
  },
  affinity: {
    label: "Affinity Match",
    color: "var(--chart-11)",
  },
} satisfies ChartConfig;

const PersonaResultsChart = ({
  result,
}: {
  result: PersonaResult["result"];
}) => {
  const chartData = [
    {
      key: "nps",
      label: "NPS",
      value: result.net_promoter_score,
      fill: "var(--color-nps)",
    },
    {
      key: "pmf",
      label: "PMF",
      value: result.pmf_score,
      fill: "var(--color-pmf)",
    },
    {
      key: "retention",
      label: "Retention",
      value: result.retention_intent,
      fill: "var(--color-retention)",
    },
    {
      key: "churn",
      label: "Churn",
      value: result.churn_probability,
      fill: "var(--color-churn)",
    },
    {
      key: "adoption",
      label: "Adoption",
      value: result.adoption_rate,
      fill: "var(--color-adoption)",
    },
    {
      key: "satisfaction",
      label: "Satisfaction",
      value: result.satisfaction_score,
      fill: "var(--color-satisfaction)",
    },
    {
      key: "usability",
      label: "Usability",
      value: result.usability_score,
      fill: "var(--color-usability)",
    },
    {
      key: "valueClarity",
      label: "Value Clarity",
      value: result.value_proposition_clarity_score,
      fill: "var(--color-valueClarity)",
    },
    {
      key: "psf",
      label: "Problem-Solution Fit",
      value: result.problem_solution_fit_score,
      fill: "var(--color-psf)",
    },
    {
      key: "tta",
      label: "Trial→Adoption",
      value: result.trial_to_adoption_score,
      fill: "var(--color-tta)",
    },
    {
      key: "affinity",
      label: "Affinity Match",
      value: result.affinity_cluster_match_score,
      fill: "var(--color-affinity)",
    },
  ];
  return (
    <ChartContainer config={chartConfig} className="w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
      >
        <CartesianGrid
          strikethroughThickness={0.5}
          strokeDasharray={"3 3"}
          vertical={true}
        />
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
          width={110}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
          formatter={(value, _, item) => {
            const v = typeof value === "number" ? value.toFixed(1) : value;
            return (
              <div className="flex w-full items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  {item?.payload?.label}
                </span>
                <span className="font-mono">{v}%</span>
              </div>
            );
          }}
        />
        <Bar
          dataKey="value"
          radius={4}
          activeBar={<Rectangle fillOpacity={0.8} />}
        />
      </BarChart>
    </ChartContainer>
  );
};
