import { useQuery } from "@tanstack/react-query";

import { simulationApiEndPoint } from "../../../../lib/api-end-point";
import { axiosPrivateInstance } from "../../../../lib/axios";
import type { AvailableModel } from "../../types";

const getAvailableModels = async (): Promise<AvailableModel[]> => {
  const response = await axiosPrivateInstance.get(
    simulationApiEndPoint.getAvailableModels
  );
  return response.data.data || response.data;
};

export const useAvailableModels = () => {
  return useQuery({
    queryKey: ["available-models"],
    queryFn: getAvailableModels,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
