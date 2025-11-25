import { useQuery } from "@tanstack/react-query";

import { simulationApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { SimulationDetailsResponse } from "../../types/simulation.types";

export const useSimulationDetails = (simulationId: string) => {
  return useQuery({
    queryKey: ["simulation-details", simulationId],
    queryFn: async (): Promise<SimulationDetailsResponse> => {
      const response = await axiosPrivateInstance.get(
        `${simulationApiEndPoint.getSimulationById}/${simulationId}`
      );
      return response.data;
    },
    enabled: !!simulationId,
  });
};
