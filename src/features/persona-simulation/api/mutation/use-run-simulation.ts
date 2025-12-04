import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { simulationApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { SimulationRequest } from "../../types";
import type { SimulationJobResponse } from "@/features/simulation-history/types/job.types";

const runSimulation = async (
  request: SimulationRequest
): Promise<SimulationJobResponse> => {
  const response = await axiosPrivateInstance.post(
    simulationApiEndPoint.runSimulation,
    request
  );
  return response.data;
};

export const useRunSimulation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: runSimulation,
    onSuccess: (data: SimulationJobResponse) => {
      // We receive a job with status (e.g. pending) and intermediate_steps.
      // After creating the job, send user to Simulation History (Active tab),
      // where /simulation-new/jobs/list + polling will keep updating the steps.
      const jobStatus = data.data.status;

      // Navigate to Simulation History; page defaults to Active tab.
      navigate("/dashboard/simulation/history");

      toast.success(
        jobStatus === "pending"
          ? "Simulation job created and queued"
          : "Simulation started successfully"
      );
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
