import { useInfiniteQuery } from "@tanstack/react-query";

import { chatbotApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCallPaginated } from "@/lib/handle-api-call";
import type { CommonPaginationResponse } from "@/types/common.type";

import type { ChatSessionHistoryItem } from "../../types";

export const useInfiniteChatHistoryQuery = ({
  page_size = 10,
}: {
  page_size?: number;
} = {}) => {
  return useInfiniteQuery({
    queryKey: ["chat-history-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      handleApiCallPaginated(async () => {
        return await axiosPrivateInstance.get<
          CommonPaginationResponse<ChatSessionHistoryItem[]>
        >(`${chatbotApiEndPoint.getChatHistory}`, {
          params: {
            page: pageParam,
            page_size,
          },
        });
      })(),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.has_next
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};
