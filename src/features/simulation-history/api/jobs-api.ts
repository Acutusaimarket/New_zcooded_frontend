import { jobsApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type {
  SimulationJob,
  SimulationJobsListResponse,
} from "../types/job.types";

interface FetchJobsParams {
  status: SimulationJob["status"];
  jobType?: string;
  page?: number;
  pageSize?: number;
}

export const fetchJobsByStatus = async ({
  status,
  jobType = "market_fit_simulation",
  page = 1,
  pageSize = 20,
}: FetchJobsParams): Promise<SimulationJobsListResponse> => {
  const response = await axiosPrivateInstance.get<SimulationJobsListResponse>(
    jobsApiEndPoint.list,
    {
      params: {
        job_type: jobType,
        status,
        page,
        page_size: pageSize,
      },
    }
  );

  return response.data;
};


