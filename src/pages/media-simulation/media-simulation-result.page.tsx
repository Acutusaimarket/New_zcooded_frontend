import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { jobsApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { MediaSimulationResults } from "@/features/media-simulation/components/MediaSimulationResults";

interface MediaSimulationResultResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
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
  };
}

export default function MediaSimulationResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<MediaSimulationResultResponse>({
    queryKey: ["media-simulation-result", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) {
        throw new Error("Missing job id");
      }
      const response = await axiosPrivateInstance.get<MediaSimulationResultResponse>(
        `${jobsApiEndPoint.getById}/${id}`
      );
      return response.data;
    },
  });

  if (!id) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Invalid simulation job</h1>
          <p className="text-muted-foreground mt-2">
            A valid job id is required to view the simulation result.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate("/dashboard/media-simulation/history")}
          >
            Back to History
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Media Simulation Result
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Loading simulation details...
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-64 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">
              <span className="font-semibold">Failed to load simulation:</span>{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/media-simulation/history")}
          >
            Back to History
          </Button>
          <Button variant="default" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Media Simulation Result
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Detailed results and recommendations for your media simulation.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard/media-simulation/history")}
        >
          Back to History
        </Button>
      </div>

      <MediaSimulationResults
        data={data.data}
        onRestart={() => navigate("/dashboard/media-simulation")}
      />
    </div>
  );
}

