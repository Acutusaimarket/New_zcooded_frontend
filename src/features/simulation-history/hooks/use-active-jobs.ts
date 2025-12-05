import { useQueries } from "@tanstack/react-query";

import { fetchJobsByStatus } from "../api/jobs-api";
import type { SimulationJobsListResponse } from "../types/job.types";

export const useActiveJobs = (jobType: string = "market_fit_simulation") => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["simulation-jobs", jobType, "in_progress"],
        queryFn: () =>
          fetchJobsByStatus({
            status: "in_progress",
            jobType,
          }),
        refetchInterval: 20000,
        refetchIntervalInBackground: true,
      },
      {
        queryKey: ["simulation-jobs", jobType, "finalizing"],
        queryFn: () =>
          fetchJobsByStatus({
            status: "finalizing",
            jobType,
          }),
        refetchInterval: 20000,
        refetchIntervalInBackground: true,
      },
    ],
  });

  const [inProgressQuery, finalizingQuery] = queries;

  const isLoading = inProgressQuery.isLoading || finalizingQuery.isLoading;
  const isError = inProgressQuery.isError || finalizingQuery.isError;
  const error = inProgressQuery.error || finalizingQuery.error;

  // Combine jobs from both queries
  const inProgressJobs = inProgressQuery.data?.data ?? [];
  const finalizingJobs = finalizingQuery.data?.data ?? [];
  const allJobs = [...inProgressJobs, ...finalizingJobs];

  // Remove duplicates based on _id
  const uniqueJobs = allJobs.filter(
    (job, index, self) => index === self.findIndex((j) => j._id === job._id)
  );

  const data: SimulationJobsListResponse = {
    status: 200,
    success: true,
    message: "Success",
    data: uniqueJobs,
    pagination_metadata: {
      total: uniqueJobs.length,
      page: 1,
      page_size: uniqueJobs.length,
    },
  };

  return {
    data,
    isLoading,
    isError,
    error,
  };
};

