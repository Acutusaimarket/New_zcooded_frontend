import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chatbotApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCall } from "@/lib/handle-api-call";
import type { ApiResponse } from "@/types/media-simulation.type";

import type { PersonaChatSession } from "../../types";

export const useAnswerQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleApiCall(
      async (data: {
        question: string;
        answer: string;
        session_id: string;
      }) => {
        return await axiosPrivateInstance.post<ApiResponse<PersonaChatSession>>(
          `${chatbotApiEndPoint.answerQuestion}`,
          data
        );
      }
    ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chat-session"] });
      if (data?._id) {
        queryClient.invalidateQueries({ queryKey: ["chat-session", data._id] });
      }
    },
  });
};
