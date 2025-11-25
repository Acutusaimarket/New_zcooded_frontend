import { useQuery } from "@tanstack/react-query";

import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCall } from "@/lib/handle-api-call";
import type { APISuccessResponse } from "@/types/common.type";

// import { mediaSimulationQueries } from "../services/media-simulation.service";
import type { MediaSimulationData } from "../types/media-simulation.types";

export const useMediaSimulationQuery = (simulationId: string) => {
  return useQuery({
    queryKey: ["media-simulation", simulationId],
    queryFn: handleApiCall(async () => {
      const response = await axiosPrivateInstance.get<
        APISuccessResponse<MediaSimulationData>
      >(`/media/${simulationId}`);
      return response;
    }),
    enabled: !!simulationId,
  });
};
