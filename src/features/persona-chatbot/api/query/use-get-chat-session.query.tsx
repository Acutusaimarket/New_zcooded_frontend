import { useQuery } from "@tanstack/react-query";

import { chatbotApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCall } from "@/lib/handle-api-call";
import type { APISuccessResponse } from "@/types/common.type";
import type { PersonaData } from "@/types/persona.type";

import type { ChatMessageType, PersonaChatSession } from "../../types";

export const useGetChatSessionQuery = ({
  id,
  message,
}: {
  id?: string;
  message?: string;
}) => {
  return useQuery({
    queryKey: ["chat-session", id],
    queryFn: handleApiCall(async () => {
      const response = await axiosPrivateInstance.get<
        APISuccessResponse<PersonaChatSession>
      >(`${chatbotApiEndPoint.getSessionById}/${id}`);

      if (!response?.data?.data?.messages?.length) {
        const initialMessage: ChatMessageType<PersonaData[]> = {
          _id: "1",
          message_content: message || "",
          answer: null,
          thinking_text: "",
          generated_personas: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          meta_data: null,
        };
        response.data.data.messages = [
          initialMessage,
          ...(response.data.data.messages || []),
        ];
      }

      return response;
    }),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
