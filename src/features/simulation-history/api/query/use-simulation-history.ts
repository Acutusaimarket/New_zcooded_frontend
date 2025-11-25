import { useQuery } from "@tanstack/react-query";

import { simulationApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type {
  SimulationFilters,
  SimulationHistoryResponse,
} from "../../types/simulation.types";

export const useSimulationHistory = (filters: SimulationFilters = {}) => {
  return useQuery({
    queryKey: ["simulation-history", filters],
    queryFn: async (): Promise<SimulationHistoryResponse> => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await axiosPrivateInstance.get(
        `${simulationApiEndPoint.getSimulationHistory}?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
