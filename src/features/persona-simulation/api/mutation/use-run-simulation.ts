import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { simulationApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type {
  MarketFitSimulationResponse,
  SimulationRequest,
} from "../../types";

const runSimulation = async (
  request: SimulationRequest
): Promise<MarketFitSimulationResponse> => {
  const response = await axiosPrivateInstance.post(
    simulationApiEndPoint.runSimulation,
    {
      ...request,
      context_layer: JSON.parse(request.context_layer || "[]"),
    }
  );
  return response.data;
};

export const useRunSimulation = () => {
  return useMutation({
    mutationFn: runSimulation,
    onSuccess: () => {
      toast.success("Simulation completed successfully");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.detail ||
            "Simulation failed"
        );
      } else {
        toast.error("Simulation failed");
      }
    },
  });
};
