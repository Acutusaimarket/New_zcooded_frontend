import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chatbotApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCall } from "@/lib/handle-api-call";
import type { APISuccessResponse } from "@/types/common.type";

import type { PersonaChatSession } from "../../types";

const useCreateChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleApiCall(async () => {
      return await axiosPrivateInstance.post<
        APISuccessResponse<PersonaChatSession>
      >(chatbotApiEndPoint.createSession, {});
    }),
    onSuccess: (data) => {
      const session = data as PersonaChatSession | undefined;
      queryClient.invalidateQueries({ queryKey: ["chat-session"] });
      if (session?._id) {
        queryClient.invalidateQueries({
          queryKey: ["chat-session", session._id],
        });
      }
    },
  });
};

export default useCreateChatSession;
