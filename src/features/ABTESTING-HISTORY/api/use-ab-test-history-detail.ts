import { useQuery } from "@tanstack/react-query";

import { abTestingApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCall } from "@/lib/handle-api-call";
import type { APISuccessResponse } from "@/types/common.type";

import type { ABTestHistoryItem } from "../types";

export const useABTestHistoryDetail = (testId: string) => {
  return useQuery({
    queryKey: ["ab-test-history-detail", testId],
    queryFn: handleApiCall(async () => {
      const response = await axiosPrivateInstance.get<
        APISuccessResponse<ABTestHistoryItem>
      >(`${abTestingApiEndPoint.getAbTestHistoryById}/${testId}`);
      return response;
    }),
    enabled: !!testId,
  });
};
