import { useEffect, useRef, useState } from "react";

import { Dialog } from "@solar-icons/react-perf/BoldDuotone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { useAuthStore } from "@/store/auth-store";
import type { PersonaData } from "@/types/persona.type";

import { useSummaryStreamMutation } from "../api/mutation/use-summary-mutation";
import {
  chatStreamWithMetadataOptions,
  useStreamMetadata,
} from "../api/query/use-chat-question-stream-query";
import { useGetChatSessionQuery } from "../api/query/use-get-chat-session.query";
import ChatInput from "../components/chat-input";
import ChatMessage from "../components/chat_message";
import { QuestionPrompt } from "../components/question-prompt";
import QuestionMessage from "../components/question_message";
import type { PersonaChatSession } from "../types";

type StreamingContent = {
  content: string;
  thinking: string;
  personas?: PersonaData[];
};

const PersonaChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // user data
  const user = useAuthStore((state) => state.user);

  // state
  const [chatMessage, setChatMessage] = useState("");
  const [streamingContent, setStreamingContent] = useState<StreamingContent>({
    content: "",
    thinking: "",
  });
  const streamingModeRef = useRef<
    "initial_prompt" | "question_answered" | "generation" | null
  >(null);
  const [queryMessage] = useQueryState(
    "message",
    parseAsString.withDefault("").withOptions({
      history: "push",
    })
  );

  const queryClient = useQueryClient();

  // refs
  const hasTriggeredStream = useRef(false);
  const hasRefetchedSession = useRef(false);

  // queries
  //1. get chat session
  const chatSessionQuery = useGetChatSessionQuery({
    id,
    message: queryMessage,
  });
  //2. stream chat response
  const {
    data,
    isFetching: isStreamFetching,
    refetch: streamQueryRefetch,
  } = useQuery({
    ...chatStreamWithMetadataOptions({
      session_id: id || "",
      message: queryMessage || "",
      mode: streamingModeRef.current || "initial_prompt",
    }),
    enabled: false,
  });

  // Mutations
  //1. stream chat response
  const summaryStreamMutation = useSummaryStreamMutation();
  const streamData = useStreamMetadata({
    data,
  });

  useEffect(() => {
    const shouldTriggerStream =
      chatSessionQuery.data?.mode === "initial_prompt" &&
      queryMessage &&
      !hasTriggeredStream.current;

    if (shouldTriggerStream) {
      hasTriggeredStream.current = true;
      hasRefetchedSession.current = false; // Reset for new stream
      streamQueryRefetch();
    }
  }, [chatSessionQuery.data?.mode, queryMessage, streamQueryRefetch]);

  useEffect(() => {
    if (streamData?.isComplete && !hasRefetchedSession.current) {
      hasRefetchedSession.current = true;
      chatSessionQuery.refetch();
    }
  }, [streamData?.isComplete, chatSessionQuery]);

  const handleChatMessageStream = async (
    mode: "initial_prompt" | "question_answered" | "generation" | null,
    data?: string
  ) => {
    setStreamingContent({
      content: "",
      thinking: "",
      personas: undefined,
    });

    if (summaryStreamMutation.isPending) {
      return toast.error("Please wait for the current stream to complete");
    }

    streamingModeRef.current = mode;

    if (!mode) {
      streamingModeRef.current = "question_answered";
    }

    let optimisticMessageId = `temp-${crypto.randomUUID()}`;

    queryClient.setQueryData(
      ["chat-session", id],
      (old: PersonaChatSession | undefined) => {
        if (!old) return old;

        const optimisticMessage = {
          _id: optimisticMessageId,
          message_content: data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          answer: "",
          thinking_text: undefined,
          generated_personas: undefined,
        };

        const optimisticMessages = {
          ...old,
          messages: [...(old.messages || []), optimisticMessage],
        };

        // console.log("✅ Optimistic message inserted:", optimisticMessages);
        return optimisticMessages;
      }
    );
    await summaryStreamMutation.mutateAsync({
      data: {
        session_id: id || "",
        message: data || "",
        mode: streamingModeRef.current!,
      },
      callbacks: {
        onChunk: (content) => {
          setStreamingContent((prev) => ({
            ...prev,
            content: prev.content + content,
          }));
        },
        onThinking: (content) => {
          setStreamingContent((prev) => ({
            ...prev,
            thinking: prev.thinking + content,
          }));
        },
        onThinkingChat: (data) => {
          queryClient.setQueryData(
            ["chat-session", id],
            (old: PersonaChatSession | undefined) => {
              if (!old) return old;

              const updatedMessages = old.messages?.map((msg) => {
                if (msg._id === optimisticMessageId) {
                  return data.chat_message;
                }
                return msg;
              });

              const result = {
                ...old,
                messages: updatedMessages,
                mode: (data.mode as PersonaChatSession["mode"]) || old.mode,
              };

              return result;
            }
          );

          // Update tracking variable to real ID for future updates
          optimisticMessageId = data.chat_message._id;

          // Clear streaming content since message is now in cache
          setStreamingContent({
            content: "",
            thinking: "",
            personas: undefined,
          });
        },
        // Update the message with personas when done event fires
        onDone: (data) => {
          // console.log("🎉 done event received:", {
          //   optimisticMessageId,
          //   personas: data?.personas,
          //   personasCount: (data?.personas as PersonaData[])?.length,
          //   chat: data?.chat_message,
          // });

          queryClient.setQueryData(
            ["chat-session", id],
            (old: PersonaChatSession | undefined) => {
              if (!old) return old;

              // By this point, optimisticMessageId is the real server ID
              // (it was updated in onThinkingChat)
              const updatedMessages = optimisticMessageId.startsWith("temp-")
                ? {
                    ...old,
                    messages: old.messages?.map((msg) =>
                      msg._id.startsWith("temp-")
                        ? {
                            ...data.chat_message,
                            generated_personas:
                              (data?.personas as PersonaData[]) || [],
                          }
                        : msg
                    ),
                  }
                : {
                    ...old,
                    messages: old.messages?.map((msg) =>
                      msg._id === optimisticMessageId
                        ? {
                            ...data.chat_message,
                            generated_personas:
                              (data?.personas as PersonaData[]) || [],
                          }
                        : msg
                    ),
                  };

              return updatedMessages;
            }
          );

          streamingModeRef.current = null;
          setStreamingContent({
            content: "",
            thinking: "",
            personas: undefined,
          });
        },
        onError: (error) => {
          toast.error(error);
          streamingModeRef.current = null;

          // Remove the specific optimistic message on error
          queryClient.setQueryData(
            ["chat-session", id],
            (old: PersonaChatSession | undefined) => {
              if (!old) return old;

              return {
                ...old,
                messages: old.messages?.filter(
                  (msg) => msg._id !== optimisticMessageId
                ),
              };
            }
          );

          setStreamingContent({
            content: "",
            thinking: "",
            personas: undefined,
          });
        },
        onRefusal: (content) => {
          toast.error(content);
          streamingModeRef.current = null;

          // Remove optimistic message on refusal
          queryClient.setQueryData(
            ["chat-session", id],
            (old: PersonaChatSession | undefined) => {
              if (!old) return old;

              return {
                ...old,
                messages: old.messages?.filter(
                  (msg) => msg._id !== optimisticMessageId
                ),
              };
            }
          );

          setStreamingContent({
            content: "",
            thinking: "",
            personas: undefined,
          });
        },
      },
    });
  };

  console.log({
    streamingModeRef: streamingModeRef.current,
  });

  const isInQuestionMode =
    chatSessionQuery.data?.mode === "question_generated" &&
    (chatSessionQuery.data?.generated_questions?.some((q) => !q.has_answered) ??
      false);

  if (!id) {
    toast.error(
      "Chat session not found redirecting to chat session create page"
    );
    navigate("/dashboard/persona-studio/chat");
    return null;
  }

  if (chatSessionQuery.isPending && !user) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (chatSessionQuery.error && !chatSessionQuery.data) {
    toast.error(chatSessionQuery.error.message);
    navigate("/dashboard/persona-studio/chat");
    return null;
  }

  const questions = chatSessionQuery.data?.generated_questions ?? [];
  const nextIndex = questions.findIndex((q) => !q.has_answered);
  const indexToShow = nextIndex === -1 ? questions.length + 1 : nextIndex + 1;

  if (chatSessionQuery.data?.messages?.length === 0) {
    return (
      <div>
        <div className="flex h-[calc(100vh-100px)] flex-col">
          <Conversation className="h-full">
            <ConversationContent>
              <ConversationEmptyState
                icon={<Dialog className="size-10" />}
                title="No messages yet"
                description="Start a conversation to see messages here"
              />
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>
      </div>
    );
  }

  // console.log({
  //   g: chatSessionQuery.data?.mode,
  // });

  return (
    <div>
      <div className="flex h-[calc(100vh-100px)] flex-col">
        <Conversation className="h-full">
          <ConversationContent>
            {/* initial message */}
            {chatSessionQuery.data?.messages
              ?.slice(0, 1)
              ?.map((message, index) => (
                <ChatMessage
                  key={`${message._id}-${index}`}
                  message={{
                    _id: message._id,
                    message_content: message.message_content || queryMessage,
                    created_at: message.created_at,
                    updated_at: message.updated_at,
                    answer:
                      message.answer ||
                      streamingContent.content ||
                      streamData.aiMessage ||
                      "Just a moment...",
                    thinking_text: "", // Remove thinking text to avoid showing JSON
                  }}
                  // isThinking={
                  //   !!message.thinking_text || !!streamingContent.thinking
                  // }
                  isPersonaGeneration={true}
                  shouldAnimate={true}
                />
              ))}
            {/* Display all unanswered questions as messages */}
            {questions?.slice(0, indexToShow).map((question, index) => (
              <QuestionMessage
                key={`question-${index}`}
                question={question}
                user_name={user?.first_name || "user"}
              />
            ))}

            {chatSessionQuery.data?.messages
              ?.slice(1, chatSessionQuery.data?.messages?.length)
              .map((message, index) => {
                // Only show streaming content for the last message that matches optimistic ID
                const isCurrentStreamingMessage =
                  message._id?.startsWith("temp-") ||
                  (index ===
                    (chatSessionQuery.data?.messages?.length || 0) - 2 &&
                    summaryStreamMutation.isPending);

                // console.log({
                //   isCurrentStreamingMessage,
                //   message,
                //   index,
                //   chatSessionQueryDataMessagesLength:
                //     chatSessionQuery.data?.messages?.length,
                // });

                return (
                  <ChatMessage
                    key={`${message._id}-${index}`}
                    message={{
                      ...message,
                      thinking_text: "", // Remove thinking text to avoid showing JSON
                      answer:
                        message.answer ||
                        (isCurrentStreamingMessage
                          ? streamingContent.content
                          : "") ||
                        (isCurrentStreamingMessage
                          ? streamData.aiMessage
                          : "") ||
                        "Just a moment...",
                      generated_personas:
                        message?.generated_personas &&
                        message?.generated_personas?.length > 0
                          ? message?.generated_personas
                          : isCurrentStreamingMessage
                            ? streamingContent.personas
                            : undefined,
                    }}
                    // isPersonaGeneration={!!message?.generated_personas && message?.generated_personas?.length > 0}
                    isThinking={
                      !!message.thinking_text ||
                      (isCurrentStreamingMessage && !!streamingContent.thinking)
                    }
                    isPersonaGeneration={
                      streamingModeRef.current === "generation" &&
                      isCurrentStreamingMessage
                    }
                    shouldAnimate={true}
                  />
                );
              })}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input area - switches between question mode and regular chat */}
        <div>
          {isInQuestionMode &&
          id &&
          chatSessionQuery.data?.generated_questions ? (
            <QuestionPrompt
              sessionId={id}
              questions={chatSessionQuery.data.generated_questions}
              onComplete={async () => {
                await handleChatMessageStream("question_answered", "");
              }}
            />
          ) : (
            <ChatInput
              value={chatMessage}
              placeholder="Start building your persona journey..."
              onChange={(e) => setChatMessage(e.target.value)}
              isLoading={isStreamFetching || summaryStreamMutation.isPending}
              handleSubmitForm={async (e) => {
                e?.preventDefault?.();
                if (!chatMessage.trim()) return;
                setChatMessage("");
                await handleChatMessageStream("generation", chatMessage);
              }}
              outerClassName={
                chatSessionQuery.data?.mode === "summary_generated"
                  ? "bg-emerald-500/50"
                  : ""
              }
            >
              {chatSessionQuery.data?.mode === "summary_generated" && (
                <GeneratingPersonaIndicator />
              )}
            </ChatInput>
          )}
        </div>
      </div>
    </div>
  );
};

const GeneratingPersonaIndicator = () => {
  return (
    <div className="text-sm text-emerald-900">
      {/* Tell us how many personas you want to generate and you can also mention
      the details of the personas you want to generate */}
    </div>
  );
};

export default PersonaChat;
