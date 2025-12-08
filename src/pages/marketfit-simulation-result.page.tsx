import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { jobsApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { MarketFitSimulationResponse } from "@/features/persona-simulation";
import type { SimulationJob } from "@/features/simulation-history/types/job.types";
import { MarketFitSimulationResults } from "@/features/persona-simulation/components/MarketFitSimulationResults";

export default function MarketFitSimulationResultPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<MarketFitSimulationResponse>({
    queryKey: ["market-fit-simulation-result", jobId],
    enabled: !!jobId,
    queryFn: async () => {
      if (!jobId) {
        throw new Error("Missing job id");
      }
      const response = await axiosPrivateInstance.get<MarketFitSimulationResponse>(
        `${jobsApiEndPoint.getById}/${jobId}`
      );
      return response.data;
    },
  });

  // Fetch job data to get product name
  const { data: jobData } = useQuery<{ data: SimulationJob }>({
    queryKey: ["market-fit-job", jobId],
    enabled: !!jobId && !!data?.data,
    queryFn: async () => {
      if (!jobId) {
        throw new Error("Missing job id");
      }
      const response = await axiosPrivateInstance.get<{ data: SimulationJob }>(
        `${jobsApiEndPoint.getById}/${jobId}`
      );
      return response.data;
    },
  });

  // Get product name from job data
  const productName =
    (jobData?.data?.product && jobData.data.product.length > 0
      ? jobData.data.product[0].name
      : null) || jobData?.data?.meta_data?.product_name || null;


  
  if (!jobId) {
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
            onClick={() => navigate("/dashboard/simulation/history")}
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
              Market Fit Simulation Result
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
            onClick={() => navigate("/dashboard/simulation/history")}
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
            Market Fit Simulation Result
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Detailed results and recommendations for your market fit simulation.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard/simulation/history")}
        >
          Back to History
        </Button>
      </div>

      <MarketFitSimulationResults
        data={data.data}
        onRestart={() => navigate("/dashboard/simulation")}
        productName={productName || undefined}
      />
    </div>
  );
}


