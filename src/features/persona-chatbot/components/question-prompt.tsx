import type { FormEvent } from "react";
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

import { LoadingSwap } from "@/components/shared/loading-swap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAnswerQuestionMutation } from "../api/mutation/use-answer-question.mutation";
import type { GeneratedQuestion, PersonaChatSession } from "../types";
import ChatInput from "./chat-input";

interface QuestionPromptProps {
  sessionId: string;
  questions: GeneratedQuestion[];
  onComplete?: () => void;
  onQuestionAnswered?: (questionIndex: number, answer: string) => void;
  className?: string;
}

export const QuestionPrompt = ({
  sessionId,
  questions,
  onComplete,
  onQuestionAnswered,
  className,
}: QuestionPromptProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const queryClient = useQueryClient();

  const answerMutation = useAnswerQuestionMutation();

  // Get unanswered questions - always show the first one
  const unansweredQuestions = questions.filter((q) => !q.has_answered);
  const currentQuestion = unansweredQuestions[0];

  if (!currentQuestion) {
    return null;
  }

  const questionNumber = questions.length - unansweredQuestions.length + 1;
  const totalQuestions = questions.length;

  const hasOptions =
    currentQuestion.answer_option && currentQuestion.answer_option.length > 0;

  const handleOptionToggle = (option: string) => {
    if (answerMutation.isPending) return;

    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((o) => o !== option);
      }
      return [...prev, option];
    });
  };

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault?.();

    // console.log("object");

    let answer = "";

    if (hasOptions) {
      answer = selectedOptions.join(", ");
      answer += `, ${textAnswer}`;
    } else {
      answer = textAnswer.trim() === "Skipped" ? "Skipped" : textAnswer;
    }

    if (!answer.trim()) {
      toast.error("Please enter an answer", {
        position: "top-right",
        duration: 3000,
        action: {
          label: "OK",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      return;
    }

    // Submit answer
    answerMutation.mutate(
      {
        session_id: sessionId,
        question: currentQuestion.question_text,
        answer: answer,
      },
      {
        onSuccess: (data) => {
          const updated = data as PersonaChatSession;
          // Update query data
          queryClient.setQueryData(
            ["chat-session", sessionId],
            (old: PersonaChatSession | undefined) => {
              if (!old) return old;
              return {
                ...old,
                generated_questions:
                  updated.generated_questions ?? old.generated_questions,
              };
            }
          );

          // Reset form
          setSelectedOptions([]);
          setTextAnswer("");

          // Notify parent
          onQuestionAnswered?.(questionNumber - 1, answer);

          // Check if all done
          const remaining = (updated.generated_questions ?? questions).filter(
            (q: { has_answered?: boolean }) => !q.has_answered
          );

          if (remaining.length === 0) {
            toast.success("All questions answered! 🎉");
            onComplete?.();
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to submit answer");
        },
      }
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Options as selectable chips/cards - shown above input */}
      {hasOptions && (
        <div className="mb-4 space-y-3">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium">
              {Math.round((questionNumber / totalQuestions) * 100)}% Complete
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            Select all that apply (or type your own response):
          </p>
          <div className="flex flex-wrap gap-2">
            {currentQuestion.answer_option?.map((option, index) => (
              <Button
                key={index}
                type="button"
                variant={
                  selectedOptions.includes(option) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleOptionToggle(option)}
                disabled={answerMutation.isPending}
                className={cn(
                  "h-auto py-2 text-left text-sm whitespace-normal transition-all",
                  selectedOptions.includes(option) && "shadow-md"
                )}
              >
                <span className="flex-1">{option}</span>
                {selectedOptions.includes(option) && (
                  <CheckIcon className="ml-2 size-3" />
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selected options display as badges */}
      {/* {hasOptions && selectedOptions.length > 0 && (
        <div className="bg-muted/50 mb-3 flex flex-wrap gap-2 rounded-lg p-3">
          <span className="text-muted-foreground text-xs">Selected:</span>
          {selectedOptions.map((option, index) => (
            <Badge key={index} variant="secondary" className="gap-1 pr-1">
              {option}
              <button
                type="button"
                onClick={() => handleOptionToggle(option)}
                disabled={answerMutation.isPending}
                className="hover:bg-background/50 ml-1 rounded-full p-0.5 transition-colors"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )} */}

      {/* Chat Input */}
      <ChatInput
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value)}
        isLoading={answerMutation.isPending}
        handleSubmitForm={handleSubmit}
        placeholder={
          hasOptions && selectedOptions.length > 0
            ? "Add more details or press send to continue..."
            : hasOptions
              ? "Choose options above or type your answer here..."
              : "Type your answer here..."
        }
      >
        <div className="flex items-center justify-between px-1 py-1">
          <span className="text-muted-foreground text-xs">
            Question {questionNumber} of {totalQuestions} •{" "}
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              onClick={() => {
                setTextAnswer("Skipped");
              }}
              disabled={answerMutation.isPending}
              className="text-muted-foreground hover:text-foreground h-auto cursor-pointer px-2 py-1 text-xs"
            >
              <LoadingSwap
                isLoading={answerMutation.isPending && textAnswer === "Skipped"}
              >
                Skip the question
              </LoadingSwap>
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={
                answerMutation.isPending ||
                (!textAnswer.trim() && selectedOptions.length === 0)
              }
              className="h-auto cursor-pointer gap-1 px-3 py-1 text-xs"
            >
              <LoadingSwap
                isLoading={answerMutation.isPending && textAnswer !== "Skipped"}
              >
                <ArrowUpIcon className="size-4" />
              </LoadingSwap>
            </Button>
          </div>
        </div>
      </ChatInput>
    </div>
  );
};
