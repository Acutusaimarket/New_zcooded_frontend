import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { chatbotApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { ChatMessageMinimal } from "../../types";
import type { PersonaChatRequest } from "../query/use-chat-question-stream-query";

export interface SSEChunkEvent {
  type: "chunk";
  content: string;
}

export interface SSEDoneEvent {
  type: "done";
  session_id: string;
  mode: string;
  chat_message: string; // JSON string that needs parsing
  personas?: string[]; // Array of persona JSON strings for generation mode
}

export interface SSEErrorEvent {
  type: "error";
  message: string;
}

export interface SSERefusalEvent {
  type: "refusal";
  content: string;
}

export interface SSEThinkingEvent {
  type: "thinking";
  content?: string;
  message?: string;
}

export interface SSEThinkingChatEvent {
  type: "thinking.chat";
  session_id: string;
  mode: string;
  chat_message: string; // JSON string that needs parsing
}

export type SSEEvent =
  | SSEChunkEvent
  | SSEDoneEvent
  | SSEErrorEvent
  | SSERefusalEvent
  | SSEThinkingEvent
  | SSEThinkingChatEvent;

export interface StreamCallbacks {
  onChunk?: (content: string) => void;
  onDone?: (data: {
    session_id: string;
    mode: string;
    chat_message: ChatMessageMinimal;
    personas?: unknown[]; // Parsed persona objects for generation mode
  }) => void;
  onError?: (error: string) => void;
  onRefusal?: (content: string) => void;
  onThinking?: (content: string) => void;
  onThinkingChat?: (data: {
    session_id: string;
    mode: string;
    chat_message: ChatMessageMinimal;
  }) => void;
}

interface ChatStreamMutationVariables {
  data: PersonaChatRequest;
  callbacks?: StreamCallbacks;
}

export const useSummaryStreamMutation = () => {
  return useMutation({
    mutationFn: async ({ data, callbacks }: ChatStreamMutationVariables) => {
      const abortController = new AbortController();

      try {
        const response = await axiosPrivateInstance.post(
          chatbotApiEndPoint.chatStream,
          data,
          {
            responseType: "stream",
            adapter: "fetch",
            headers: {
              Accept: "text/event-stream",
            },
          }
        );
        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                // const jsonData = JSON.parse(line.slice(6));
                const event: SSEEvent = JSON.parse(line.slice(6));

                switch (event.type) {
                  case "chunk":
                    callbacks?.onChunk?.(event.content);
                    break;
                  case "thinking.chat": {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rawMessage = JSON.parse(event.chat_message) as any;

                    // Normalize ID field (server returns "id" but we need "_id")
                    const chatMessage: ChatMessageMinimal = {
                      ...rawMessage,
                      _id: rawMessage._id || rawMessage.id,
                    };

                    callbacks?.onThinkingChat?.({
                      session_id: event.session_id,
                      mode: event.mode,
                      chat_message: chatMessage,
                    });
                    break;
                  }
                  case "done": {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rawMessage = JSON.parse(event.chat_message) as any;

                    // Normalize ID field (server returns "id" but we need "_id")
                    const chatMessage: ChatMessageMinimal = {
                      ...rawMessage,
                      _id: rawMessage._id || rawMessage.id,
                    };

                    // Parse personas if they exist (for generation mode)
                    let personas: unknown[] | undefined;
                    if (event.personas && Array.isArray(event.personas)) {
                      personas = event.personas.map((personaStr) =>
                        JSON.parse(personaStr)
                      );
                    }

                    // console.log({
                    //   parsedMessage: chatMessage,
                    //   personas,
                    // });

                    callbacks?.onDone?.({
                      session_id: event.session_id,
                      mode: event.mode,
                      chat_message: chatMessage,
                      personas,
                    });
                    break;
                  }
                  case "error":
                    callbacks?.onError?.(event.message);
                    break;
                  case "refusal":
                    callbacks?.onRefusal?.(event.content);
                    break;
                  case "thinking":
                    callbacks?.onThinking?.(
                      event.content || event.message || ""
                    );
                    break;
                }
              } catch (parseError) {
                console.error("Failed to parse SSE data:", parseError, line);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            // console.log("Stream aborted");
            toast.error("Stream aborted");
          } else {
            throw error;
          }
        } else {
          throw new Error("Unknown error occurred");
        }
      } finally {
        abortController.abort();
      }
    },
  });
};
