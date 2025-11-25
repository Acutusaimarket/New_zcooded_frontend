import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { abTestingApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { APISuccessResponse } from "@/types/common.type";

import type {
  ABTestHistoryFilters,
  ABTestHistoryItem,
  ABTestHistoryResponse,
} from "../types";

export const useABTestHistoryQuery = (filters: ABTestHistoryFilters = {}) => {
  const { page = 1, per_page = 10, status, date_range, search } = filters;

  return useQuery({
    queryKey: ["ab-test-history", filters],
    queryFn: async (): Promise<ABTestHistoryResponse> => {
      const queryParams = new URLSearchParams();

      queryParams.append("page", page.toString());
      queryParams.append("per_page", per_page.toString());

      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);
      if (date_range?.start_date)
        queryParams.append("start_date", date_range.start_date);
      if (date_range?.end_date)
        queryParams.append("end_date", date_range.end_date);

      const response = await axiosPrivateInstance.get<ABTestHistoryResponse>(
        `${abTestingApiEndPoint.getAbTestHistory}?${queryParams.toString()}`
      );

      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        return false; // Don't retry on 404
      }
      return failureCount < 3;
    },
  });
};

// Stats are now calculated from the main history data
// export const useABTestHistoryStatsQuery = () => { ... }

export const useABTestHistoryByIdQuery = (testId: string) => {
  return useQuery({
    queryKey: ["ab-test-history", testId],
    queryFn: async (): Promise<ABTestHistoryItem> => {
      const response = await axiosPrivateInstance.get<
        APISuccessResponse<ABTestHistoryItem>
      >(`${abTestingApiEndPoint.getAbTestHistoryById}/${testId}`);

      return response.data.data;
    },
    enabled: !!testId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
