import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { authApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import type { TokenUsageData } from "@/types/token-usage.type";
import type { APISuccessResponse } from "@/types/common.type";

export const useTokenUsage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["token-usage"],
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        const response = await axiosPrivateInstance.get<
          APISuccessResponse<TokenUsageData>
        >(authApiEndPoint.tokenUsage, {
          withCredentials: true,
        });

        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            throw new Error("Unauthorized access. Please log in again.");
          }

          throw new Error(
            error.response?.data?.message || "Failed to fetch token usage"
          );
        }
        throw new Error(
          "An unexpected error occurred while fetching token usage"
        );
      }
    },
    staleTime: 0, // Always consider data stale to allow refetching
    refetchInterval: 5 * 1000, // Refetch every 5 seconds
    retry: (failureCount, error) => {
      if (error.message === "Unauthorized access. Please log in again.") {
        return false;
      }
      return failureCount < 2;
    },
  });
};

