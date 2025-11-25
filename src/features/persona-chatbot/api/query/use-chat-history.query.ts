import { useQuery } from "@tanstack/react-query";

import { chatbotApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCallPaginated } from "@/lib/handle-api-call";
import type { CommonPaginationResponse } from "@/types/common.type";

import type { ChatSessionHistoryItem } from "../../types";

export const useChatHistoryQuery = ({
  page = 1,
  page_size = 10,
}: {
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: ["chat-history"],
    queryFn: handleApiCallPaginated(async () => {
      return await axiosPrivateInstance.get<
        CommonPaginationResponse<ChatSessionHistoryItem[]>
      >(`${chatbotApiEndPoint.getChatHistory}`, {
        params: {
          page,
          page_size,
        },
      });
    }),
  });
};
