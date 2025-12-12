import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ABTestHistoryItem } from "@/features/ABTESTING-HISTORY/types";
import { abTestingApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCall } from "@/lib/handle-api-call";
import type { APISuccessResponse } from "@/types/common.type";

import type { ABTestRequest } from "../types";

export const useRunABTest = () => {
  const queryClient = useQueryClient();

  return useMutation<ABTestHistoryItem, Error, ABTestRequest>({
    mutationFn: handleApiCall(async (data: ABTestRequest) => {
      const res = await axiosPrivateInstance.post<
        APISuccessResponse<ABTestHistoryItem>
      >(abTestingApiEndPoint.runAbTest, {
        ...data,
      });
      return res;
    }),
    onSuccess: (data) => {
      // Refresh AB test history and any cached detail for this test
      queryClient.invalidateQueries({ queryKey: ["ab-test-history"] });
      if (data?._id) {
        queryClient.invalidateQueries({ queryKey: ["ab-test-history", data._id] });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
