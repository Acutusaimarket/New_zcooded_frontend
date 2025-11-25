import {
  queryOptions,
  experimental_streamedQuery as streamedQuery,
} from "@tanstack/react-query";

import { chatbotApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { GeneratedQuestion } from "../../types";

export interface PersonaChatRequest {
  session_id: string;
  message: string;
  mode: "initial_prompt" | "question_answered" | "generation";
}

interface StreamChunk {
  type: "chunk" | "done" | "error" | "refusal" | "info";
  content?: string;
  message?: string;
  session_id?: string;
  questions_count?: number;
  mode?: string;
}

/**
 * Creates query options for streaming chat responses using TanStack Query's streamedQuery
 *
 * @param request - The chat request data
 * @returns Query options for use with useQuery
 *
 * @example
 * ```tsx
 * const { data, isFetching, error } = useQuery(
 *   chatStreamQueryOptions({
 *     session_id: "123",
 *     message: "Hello",
 *     mode: "initial_prompt"
 *   })
 * );
 *
 * // data will be an array of strings that updates in real-time
 * const fullText = data?.join('') || '';
 * ```
 */
export const chatStreamQueryOptions = (request: PersonaChatRequest) => {
  return queryOptions({
    queryKey: [
      "chat-stream",
      request.session_id,
      request.message,
      request.mode,
    ],
    queryFn: streamedQuery({
      queryFn: async () => {
        return {
          async *[Symbol.asyncIterator]() {
            // Make the request using axiosPrivateInstance with fetch adapter
            const response = await axiosPrivateInstance.post(
              chatbotApiEndPoint.chatStream,
              request,
              {
                responseType: "stream",
                adapter: "fetch",
                headers: {
                  Accept: "text/event-stream",
                },
              }
            );

            // Get the response body reader
            const reader = response.data.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            try {
              while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                // Decode the chunk
                buffer += decoder.decode(value, { stream: true });

                // Process complete SSE messages
                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep incomplete line in buffer

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const jsonData = JSON.parse(line.slice(6)) as StreamChunk;

                      if (jsonData.type === "chunk" && jsonData.content) {
                        // Yield the chunk content
                        yield jsonData.content;
                      } else if (jsonData.type === "done") {
                        // Stream completed
                        return;
                      } else if (jsonData.type === "error") {
                        // Throw error to let TanStack Query handle it
                        throw new Error(jsonData.message || "Stream error");
                      } else if (jsonData.type === "refusal") {
                        // Yield refusal content if present
                        if (jsonData.content) {
                          yield jsonData.content;
                        }
                      }
                    } catch (parseError) {
                      console.error("Failed to parse SSE data:", parseError);
                    }
                  }
                }
              }
            } finally {
              reader.releaseLock();
            }
          },
        };
      },
    }),
    // Don't automatically refetch
    staleTime: Infinity,
    // Keep query disable by default - can be controlled by consumer
    enabled: false,
  });
};

/**
 * Alternative: Query options that yield full chunk objects for metadata access
 * This allows you to access completion metadata from the stream
 *
 * @example
 * ```tsx
 * const { data, isFetching } = useQuery(
 *   chatStreamWithMetadataOptions({
 *     session_id: "123",
 *     message: "Hello",
 *     mode: "initial_prompt"
 *   })
 * );
 *
 * // Filter to get text chunks
 * const textChunks = data?.filter(c => c.type === 'chunk' && c.content) || [];
 * const fullText = textChunks.map(c => c.content).join('');
 *
 * // Get metadata from done event
 * const doneEvent = data?.find(c => c.type === 'done');
 * const metadata = doneEvent ? {
 *   session_id: doneEvent.session_id,
 *   questions_count: doneEvent.questions_count,
 *   mode: doneEvent.mode,
 *   message: doneEvent.message
 * } : null;
 * ```
 */
export const chatStreamWithMetadataOptions = (request: PersonaChatRequest) => {
  return queryOptions({
    queryKey: ["chat-stream-meta", request.session_id, request.mode],
    queryFn: streamedQuery({
      queryFn: async () => {
        return {
          async *[Symbol.asyncIterator]() {
            const response = await axiosPrivateInstance.post(
              chatbotApiEndPoint.chatStream,
              request,
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

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const jsonData = JSON.parse(line.slice(6)) as StreamChunk;

                      // Yield the entire chunk object for more control
                      yield jsonData;
                    } catch (parseError) {
                      console.error("Failed to parse SSE data:", parseError);
                    }
                  }
                }
              }
            } finally {
              reader.releaseLock();
            }
          },
        };
      },
    }),
    staleTime: Infinity,
    enabled: true,
  });
};

/**
 * Helper hook to process metadata from streamed chunks
 * Use this with chatStreamWithMetadataOptions to extract metadata easily

 * @example
 * ```tsx
 * const { data } = useQuery(chatStreamWithMetadataOptions(request));
 * const { markdownContent, personaName, aiMessage, parsedData } = useStreamMetadata(data);
 *
 * // Use markdownContent for rendering with react-markdown
 * <ReactMarkdown>{markdownContent}</ReactMarkdown>
 * ```
 */
export const useStreamMetadata = ({
  data,
}: {
  data: StreamChunk[] | undefined;
}) => {
  if (!data) {
    return {
      chunks: [],
      fullContent: "",
      markdownContent: "",
      personaName: null,
      aiMessage: null,
      parsedData: null,
      metadata: null,
      isComplete: false,
      error: null,
      parsedQuestionData: null,
    };
  }

  const chunks = data
    .filter((c) => c.type === "chunk" && c.content)
    .map((c) => c.content!);

  const fullContent = chunks.join("");

  const doneEvent = data.find((c) => c.type === "done");
  const errorEvent = data.find((c) => c.type === "error");

  // Try to parse the fullContent as JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsedData: any = null;
  let personaName = null;
  let aiMessage = null;
  let markdownContent = "";
  let parsedQuestionData: GeneratedQuestion[] = [];

  try {
    if (fullContent.trim()) {
      parsedData = JSON.parse(fullContent);
      // Ensure all questions have required properties initialized
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parsedQuestionData = (parsedData.questions || []).map((q: any) => ({
        ...q,
        has_answered: q.has_answered ?? false,
        answer: q.answer ?? null,
        answer_option: q.answer_option ?? null,
      }));
      personaName = parsedData.name || null;
      aiMessage = parsedData.message || doneEvent?.message || null;
      markdownContent = formatPersonaAsMarkdown(parsedData);
    }
  } catch {
    // If not JSON, treat as plain text/markdown
    aiMessage = doneEvent?.message || null;

    if (aiMessage) {
      markdownContent = `${aiMessage}\n\n`;
    }
    markdownContent += fullContent;
  }

  const metadata = doneEvent
    ? {
        session_id: doneEvent.session_id,
        questions_count: doneEvent.questions_count,
        mode: doneEvent.mode,
      }
    : null;

  return {
    chunks,
    fullContent,
    markdownContent,
    personaName,
    aiMessage,
    parsedData,
    metadata,
    isComplete: !!doneEvent,
    error: errorEvent?.message || null,
    parsedQuestionData,
  };
};

/**
 * Format persona data as markdown
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPersonaAsMarkdown(data: any): string {
  if (!data) return "";

  let markdown = "";

  // Add persona name as header
  // if (data.name) {
  //   markdown += `# ${data.name}\n\n`;
  // }

  // Add AI message
  if (data.message) {
    markdown += `> ${data.message}\n\n`;
  }

  // Add questions and answers
  if (data.questions && Array.isArray(data.questions)) {
    // markdown += "## Questions\n\n";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.questions.forEach((q: any) => {
      // Question number and text
      markdown += `- ${q.question_text}\n\n`;

      // Show answer if provided
      // if (q.has_answered && q.answer) {
      //   markdown += `**Answer:** ${q.answer}\n\n`;
      // } else {
      //   markdown += `**Answer:** *Not answered yet*\n\n`;
      // }

      // Show answer options if available
      // if (
      //   q.answer_option &&
      //   Array.isArray(q.answer_option) &&
      //   q.answer_option.length > 0
      // ) {
      //   markdown += `**Options:**\n`;
      //   q.answer_option.forEach((option: string) => {
      //     const isSelected = q.has_answered && q.answer === option;
      //     markdown += isSelected ? `- ✓ ${option}\n` : `- ${option}\n`;
      //   });
      //   markdown += "\n";
      // }

      // markdown += "---\n\n";
    });
  }

  return markdown;
}
