import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { authApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import type { UserType } from "@/types/user.type";

export const useGetAuthenticatedUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["user"],
    enabled: isAuthenticated,
    queryFn: async () => {
      try {
        const response = await axiosPrivateInstance.get<UserType>(
          authApiEndPoint.getUserInfo,
          {
            withCredentials: true,
          }
        );

        // Update user data in store
        useAuthStore.getState().updateUser(response.data);
        useAuthStore.getState().checkAuthStatus();
        return response.data;
      } catch (error) {
        useAuthStore.getState().logout();
        if (error instanceof Error) {
          throw new Error(error.message || "Failed to fetch user data");
        }
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            throw new Error("Unauthorized access. Please log in again.");
          }

          throw new Error(
            error.response?.data?.detail || "Failed to fetch user data"
          );
        }
        throw new Error(
          "An unexpected error occurred while fetching user data"
        );
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Retry up to 3 times on failure
      if (error.message === "Unauthorized access. Please log in again.") {
        return false; // Do not retry on unauthorized access
      }
      return failureCount < 3;
    },
  });
};
