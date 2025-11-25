import { Link } from "react-router";

import {
  Message,
  MessageAvatar,
  MessageContent,
  messageContentVariants,
} from "@/components/ai-elements/message";
import { PersonaGenerationList } from "@/components/ai-elements/persona-generation";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { PersonaCard } from "@/features/persona-management/components/PersonaCard";
import { cn } from "@/lib/utils";
import type { PersonaData } from "@/types/persona.type";

import type { ChatMessageType } from "../types";

// Skeleton loader for persona cards
const PersonaSkeletonCard = () => {
  return (
    <div className="border-border bg-card space-y-4 rounded-lg border p-6">
      <div className="space-y-3">
        {/* Title skeleton */}
        <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="bg-muted h-4 w-full animate-pulse rounded" />
          <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
        </div>
      </div>

      {/* Demographics section skeleton */}
      <div className="space-y-2">
        <div className="bg-muted h-4 w-32 animate-pulse rounded" />
        <div className="flex flex-wrap gap-2">
          <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
          <div className="bg-muted h-6 w-24 animate-pulse rounded-full" />
          <div className="bg-muted h-6 w-28 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Traits section skeleton */}
      <div className="space-y-2">
        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
        <div className="space-y-1">
          <div className="bg-muted h-3 w-full animate-pulse rounded" />
          <div className="bg-muted h-3 w-4/5 animate-pulse rounded" />
        </div>
      </div>

      {/* Action button skeleton */}
      <div className="bg-muted h-10 w-full animate-pulse rounded" />
    </div>
  );
};

interface ChatMessageProps {
  message: ChatMessageType<PersonaData[]>;
  isThinking?: boolean;
  shouldAnimate?: boolean;
  isPersonaGeneration?: boolean;
}

const ChatMessage = ({
  message,
  isThinking = false,
  shouldAnimate = true,
  isPersonaGeneration = false,
}: ChatMessageProps) => {
  return (
    <>
      {message.message_content && (
        <Message from={"user"}>
          <MessageContent variant={"contained"}>
            <Response
              isAnimating={shouldAnimate}
              parseIncompleteMarkdown={true}
            >
              {message.message_content}
            </Response>
          </MessageContent>
          {/* <MessageAvatar
            name={"user"}
            src={"https://ui-avatars.com/api/?name=user"}
          /> */}
        </Message>
      )}

      {message.answer && (
        <Message from={"assistant"}>
          <MessageContent variant={"flat"}>
            <div
              className={cn(messageContentVariants({ variant: "contained" }))}
            >
              {message.answer && !isPersonaGeneration && (
                <>
                  <Response
                    isAnimating={shouldAnimate}
                    parseIncompleteMarkdown={true}
                  >
                    {message.answer}
                  </Response>
                  {isThinking && (
                    <p className="text-muted-foreground mt-2 text-sm">
                      Thinking...
                    </p>
                  )}
                </>
              )}
              {/* Show skeleton loaders when thinking about personas but not yet received */}
              {isPersonaGeneration && (
                <div>
                  <p className="text-xl font-medium">Generating Personas</p>
                  <PersonaGenerationList className="grid max-w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {[1, 2].map((index) => (
                      <PersonaSkeletonCard key={index} />
                    ))}
                  </PersonaGenerationList>
                </div>
              )}

              {/* Show actual personas when received */}
              {message.generated_personas &&
                message.generated_personas.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between py-4">
                      <p className="text-xl font-medium">Generated Personas</p>
                      <Button size={"sm"} asChild>
                        <Link to={`/dashboard/persona-studio/management`}>
                          Manage Personas
                        </Link>
                      </Button>
                    </div>
                    <PersonaGenerationList className="grid max-w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {message.generated_personas?.map((persona, index) => (
                        <PersonaCard
                          key={persona._id || `persona-${index}`}
                          persona={persona}
                          disabledActionButton={true}
                        />
                      ))}
                    </PersonaGenerationList>
                  </div>
                )}
            </div>
          </MessageContent>
          <MessageAvatar
            name={"Assistant"}
            src={"https://ui-avatars.com/api/?name=Assistant"}
          />
        </Message>
      )}
    </>
  );
};

export default ChatMessage;
