import { useQuery } from "@tanstack/react-query";
import type { Query } from "@tanstack/react-query";

import { mediaSimulationApiEndPoint, simulationApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCall } from "@/lib/handle-api-call";
import type { APISuccessResponse } from "@/types/common.type";

import type { SimulationJob } from "../types/job.types";

interface UseJobStatusOptions {
  jobId: string | null;
  jobType?: "simulation" | "media_simulation";
  enabled?: boolean;
  refetchInterval?: number;
}

export const useJobStatus = ({
  jobId,
  jobType = "simulation",
  enabled = true,
  refetchInterval = 20000, // 20 seconds
}: UseJobStatusOptions) => {
  const endpoint =
    jobType === "media_simulation"
      ? mediaSimulationApiEndPoint.getJobStatus
      : simulationApiEndPoint.getJobStatus;

  const query = useQuery<SimulationJob>({
    queryKey: ["simulation-job", jobId, jobType],
    queryFn: handleApiCall(async () => {
      if (!jobId) {
        throw new Error("Job ID is required");
      }
      const response = await axiosPrivateInstance.get<
        APISuccessResponse<SimulationJob>
      >(`${endpoint}/${jobId}`);
      return response;
    }),
    enabled: enabled && !!jobId,
    refetchInterval: (query: Query<SimulationJob>) => {
      // Stop polling if job is completed, failed, or interrupted
      const jobData = query.state.data;
      if (
        jobData?.status === "completed" ||
        jobData?.status === "failed" ||
        jobData?.status === "interrupted"
      ) {
        return false;
      }
      return refetchInterval;
    },
    refetchIntervalInBackground: true,
  });

  return query;
};

