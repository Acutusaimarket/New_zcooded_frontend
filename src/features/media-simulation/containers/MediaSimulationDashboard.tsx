import { Chart } from "@solar-icons/react-perf/BoldDuotone";
import {
  AlertCircle,
  // Lightbulb,
  RefreshCw,
  // Scale,
  Search,
  User,
} from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";

import { ContextLayerDisplay } from "@/components/shared/context-layer-display";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Analysis Components
import { IndividualAnalysis } from "../components/analysis/IndividualAnalysis";
// Chart Components
import { EffectivenessBarChart } from "../components/charts/EffectivenessBarChart";
// Comparison Components (commented out - will be used later)
// import { ComparisonMatrix } from "../components/comparison/ComparisonMatrix";
// Layout Components
import { DashboardLayout } from "../components/layout/DashboardLayout";
// Overview Components
// import { FinalRecommendation } from "../components/overview/FinalRecommendation";
import { CustomQuestionsOverview } from "../components/overview/CustomQuestionsOverview";
import { GeneralCustomResponses } from "../components/overview/GeneralCustomResponses";
import { MediaMetrics } from "../components/overview/MediaMetrics";
import { SimulationHeader } from "../components/overview/SimulationHeader";
// import { StatusIndicators } from "../components/overview/StatusIndicators";
// Persona Components
import { PersonaProfile } from "../components/persona/PersonaProfile";
// Recommendations Components (commented out - will be used later)
// import { RecommendationsPanel } from "../components/recommendations/RecommendationsPanel";
// Hooks
import { useChartData } from "../hooks/useChartData";
import { useMediaSimulationQuery } from "../hooks/useMediaSimulationQuery";

interface MediaSimulationDashboardProps {
  simulationId: string;
}

export const MediaSimulationDashboard = ({
  simulationId,
}: MediaSimulationDashboardProps) => {
  const {
    data,
    isPending: loading,
    error,
    refetch,
  } = useMediaSimulationQuery(simulationId);
  const chartData = useChartData(data || null);

  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringEnum([
      "overview",
      "analysis",
      // "comparison",
      "persona",
      // "recommendations",
    ]).withDefault("overview")
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-96 w-full" />
          <div className="flex space-x-8 border-b">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Failed to load simulation data:{" "}
              {error?.message || "Unknown error"}
            </span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-1 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No simulation data found for ID: {simulationId}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <SimulationHeader data={data} />

        {/* Tabs Navigation and Content */}
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) =>
            setActiveTab(
              value as "overview" | "analysis" | "persona"
              // | "comparison"
              // | "recommendations"
            )
          }
          className="w-full"
        >
          <TabsList className="mb-3 grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              {/* <BarChart3 className="h-4 w-4" /> */}
              <Chart size={64} className="size-[1.5em]" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            {/* <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Comparison
            </TabsTrigger> */}
            <TabsTrigger value="persona" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Persona
            </TabsTrigger>
            {/* <TabsTrigger
              value="recommendations"
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="min-h-[600px]">
            <div className="space-y-6">
              {/* Final Recommendation - moved from Comparison tab and placed at top */}
              {/* <FinalRecommendation data={data} /> */}
              <MediaMetrics data={data} />
              {/* <StatusIndicators data={data} /> */}

              {/* General Custom Questions Responses (top-level) */}
              <GeneralCustomResponses data={data} />

              {/* Custom Questions Overview (per-persona) */}
              <CustomQuestionsOverview data={data} />

              {/* Context Layer Display */}
              <ContextLayerDisplay contextLayer={data.context_layer} />

              {chartData.performanceOverview.length > 0 && (
                <div className="bg-card rounded-lg p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Performance Overview
                  </h3>
                  <EffectivenessBarChart
                    data={chartData.performanceOverview}
                    height={400}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="min-h-[600px]">
            <IndividualAnalysis data={data} />
          </TabsContent>

          {/* <TabsContent value="comparison" className="min-h-[600px]">
            <ComparisonMatrix data={data} />
          </TabsContent> */}

          <TabsContent value="persona" className="min-h-[600px]">
            <PersonaProfile data={data} />
          </TabsContent>

          {/* <TabsContent value="recommendations" className="min-h-[600px]">
            <RecommendationsPanel data={data} />
          </TabsContent> */}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
