import { useQuery } from "@tanstack/react-query";

import { fetchJobsByStatus } from "../api/jobs-api";
import type {
  SimulationJob,
  SimulationJobsListResponse,
} from "../types/job.types";

export const useJobsByStatus = (
  status: SimulationJob["status"],
  jobType: string = "market_fit_simulation"
) => {
  return useQuery<SimulationJobsListResponse>({
    queryKey: ["simulation-jobs", jobType, status],
    queryFn: () =>
      fetchJobsByStatus({
        status,
        jobType,
      }),
    // Poll for active jobs (in_progress or finalizing)
    refetchInterval:
      status === "in_progress" || status === "finalizing" ? 20000 : false,
    refetchIntervalInBackground: true,
  });
};
