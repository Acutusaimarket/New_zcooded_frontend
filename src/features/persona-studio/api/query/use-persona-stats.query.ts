import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { PersonaStatsData } from "../../types";

export const usePersonaStatsQuery = () => {
  return useQuery({
    queryKey: ["persona-stats"],
    queryFn: async () => {
      try {
        const response = await axiosPrivateInstance.get<PersonaStatsData>(
          personasApiEndPoint.getPersonasStats
        );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.detail || "Failed to fetch persona stats"
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
