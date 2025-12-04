import { useQuery } from "@tanstack/react-query";

import { jobsApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { APISuccessResponse } from "@/types/common.type";

export const useMediaSimulationQuery = (simulationId: string) => {
  const isEnabled = !!simulationId;
  console.log("useMediaSimulationQuery called with:", { simulationId, isEnabled });
  
  return useQuery({
    queryKey: ["media-simulation", simulationId],
    queryFn: async () => {
      try {
        console.log("=== QUERY FUNCTION EXECUTING ===");
        console.log("Fetching simulation data for ID:", simulationId);
        console.log("API Endpoint:", `${jobsApiEndPoint.getById}/${simulationId}`);
        
        // Don't use handleApiCall here since we need to process the response structure
        const response = await axiosPrivateInstance.get<
          APISuccessResponse<any>
        >(`${jobsApiEndPoint.getById}/${simulationId}`);
        
        console.log("=== API CALL COMPLETED ===");
        
        console.log("Raw API Response:", response);
        console.log("Response data:", response.data);
        
        const responseData = response.data?.data || response.data;
        console.log("Response data:", responseData);
        return responseData;
      } catch (error) {
        console.error("Error in useMediaSimulationQuery:", error);
        throw error;
      }
    },
    enabled: isEnabled,
    retry: 1,
  });
};
