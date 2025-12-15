import { useCallback, useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
// import { Rocket } from "@solar-icons/react-perf/BoldDuotone";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  Loader2Icon,
  MessageSquareIcon,
  PlusIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { LoadingSwap } from "@/components/shared/loading-swap";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAuthStore } from "@/store/auth-store";

import useCreateChatSession from "../api/query/use-create-chat-session";
import { useInfiniteChatHistoryQuery } from "../api/query/use-infinite-chat-history.query";
import type { ChatSessionHistoryItem, PersonaChatSession } from "../types";

const getGreeting = () => {
  const hour = new Date().getHours();
  const greetings = {
    morning: ["Good morning", "Rise and shine", "Morning"],
    afternoon: ["Good afternoon", "How's it going", "What's good"],
    evening: ["Good evening", "Hope you're doing well", "Back at it again"],
    night: ["Back at it", "Ready when you are", "Let's get started"],
  };

  let timeOfDay;
  if (hour < 12) timeOfDay = "morning";
  else if (hour < 17) timeOfDay = "afternoon";
  else if (hour < 21) timeOfDay = "evening";
  else timeOfDay = "night";

  const options = greetings[timeOfDay as keyof typeof greetings];
  return options[Math.floor(Math.random() * options.length)];
};

export default function PersonaChatSession() {
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState("");
  const sessionCreateMutation = useCreateChatSession();
  const navigate = useNavigate();

  const tagLine = useMemo(() => getGreeting(), []);

  // Chat history query
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteChatHistoryQuery({
      page_size: 10,
    });

  // Flatten all pages into a single array
  const allChatHistory = data?.pages.flatMap((page) => page.items) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleCreateSession = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (!message.trim()) {
        toast.error("Please enter a message", {
          position: "top-center",
        });
        return;
      }

      sessionCreateMutation.mutate(undefined, {
        onSuccess: (data) => {
          const session = data as PersonaChatSession;
          navigate(
            `/dashboard/persona-studio/chat/${session._id}?message=${message
              .split(" ")
              .join("+")}`
          );
        },
        onError: (error) => {
          toast.error(error.message, {
            position: "top-center",
          });
        },
      });
    },
    [message]
  );

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3">
        <Button asChild size={"sm"}>
          <Link to="/dashboard/persona-studio">
            <ChevronLeftIcon />
            Back to Persona Studio
          </Link>
        </Button>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="flex items-center justify-center gap-3 text-4xl tracking-tight md:text-5xl">
              {/* <Rocket className="text-primary mt-2 size-8 md:size-10" /> */}
              {tagLine},{""}
              <span className="capitalize">{user.first_name}</span>
            </h1>
          </div>

          {/* Input Area */}
          <form onSubmit={handleCreateSession}>
            <InputGroup className="rounded-full shadow-xl focus-within:shadow-lg">
              <InputGroupAddon align="inline-start">
                <InputGroupButton
                  variant="ghost"
                  className="cursor-pointer rounded-full disabled:cursor-not-allowed"
                  size="icon-sm"
                  disabled={sessionCreateMutation.isPending}
                  type="button"
                >
                  <PlusIcon className="size-5" />
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Start building your persona journey..."
                className="border-0 text-base"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sessionCreateMutation.isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (message.trim()) {
                      handleCreateSession();
                    } else {
                      toast.error("Please enter a message", {
                        position: "top-center",
                      });
                    }
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                <DropdownMenu>
                  <DropdownMenuTrigger disabled asChild>
                    <InputGroupButton
                      variant="ghost"
                      className="cursor-pointer disabled:cursor-not-allowed"
                      disabled={true}
                      type="button"
                    >
                      Auto
                    </InputGroupButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="[--radius:0.95rem]"
                  >
                    <DropdownMenuItem>Auto</DropdownMenuItem>
                    <DropdownMenuItem>Agent</DropdownMenuItem>
                    <DropdownMenuItem>Manual</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <InputGroupButton
                  variant="default"
                  className="cursor-pointer rounded-full disabled:cursor-not-allowed"
                  size="icon-sm"
                  disabled={!message.trim()}
                  type="submit"
                >
                  <LoadingSwap isLoading={sessionCreateMutation.isPending}>
                    <ArrowUpIcon className="size-4" />
                  </LoadingSwap>
                  <span className="sr-only">Send</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>

          {/* Chat History Section */}
          <div className="mt-8">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Recent Conversations
            </h2>
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-muted-foreground flex items-center justify-center py-8">
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Loading chat history...
                </div>
              ) : allChatHistory.length > 0 ? (
                <>
                  {allChatHistory.map((chat: ChatSessionHistoryItem) => (
                    <Link
                      key={chat._id}
                      to={`/dashboard/persona-studio/chat/${chat._id}`}
                      className="hover:bg-accent group border-border bg-card flex items-center gap-3 rounded-full border px-4 py-3 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
                        <MessageSquareIcon className="size-4" />
                      </div>
                      <span
                        className="flex-1 truncate text-sm"
                        title={chat.name}
                      >
                        {chat.name}
                      </span>
                      <div className="bg-foreground flex shrink-0 items-center justify-center rounded-full p-2 transition-transform group-hover:translate-x-0.5">
                        <ArrowRightIcon className="text-background size-4" />
                      </div>
                    </Link>
                  ))}

                  {/* Load More Button */}
                  {hasNextPage && (
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      className="w-full"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2Icon className="mr-2 size-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground border-border rounded-lg border border-dashed py-8 text-center">
                  No chat history yet. Start a new conversation above!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
