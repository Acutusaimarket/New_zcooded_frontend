import type { ComponentProps, FormEvent } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { LoadingSwap } from "@/components/shared/loading-swap";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface ChatInputProps extends ComponentProps<"textarea"> {
  isLoading: boolean;
  handleSubmitForm: (e?: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  outerClassName?: string;
}

const ChatInput = ({
  isLoading,
  handleSubmitForm,
  placeholder = "Start building your persona journey...",
  outerClassName,
  ...props
}: ChatInputProps) => {
  return (
    <form onSubmit={handleSubmitForm}>
      <InputGroup
        className={cn(
          "bg-muted rounded-xl shadow-xl focus-within:shadow-lg",
          outerClassName
        )}
      >
        {props.children && (
          <InputGroupAddon
            className="w-full rounded-t-xl shadow-inner"
            align={"block-start"}
          >
            {props.children}
          </InputGroupAddon>
        )}
        <InputGroupTextarea
          placeholder={placeholder}
          className="bg-background max-h-24 min-h-16 rounded-t-2xl !text-base"
          {...props}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (props.value?.toString().trim()) {
                handleSubmitForm(undefined);
              } else {
                toast.error("Please enter a message");
              }
            }
          }}
        />
        <InputGroupAddon
          align="block-end"
          className="bg-background rounded-b-xl"
        >
          <InputGroupButton
            variant="outline"
            className="cursor-pointer rounded-full shadow-xs disabled:cursor-not-allowed"
            size="icon-sm"
            type="button"
            disabled={true}
          >
            <PlusIcon />
          </InputGroupButton>
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
            className="ml-auto cursor-pointer rounded-full disabled:cursor-not-allowed"
            size="icon-sm"
            type="submit"
            disabled={isLoading}
          >
            <LoadingSwap isLoading={isLoading}>
              <ArrowUpIcon className="size-4" />
            </LoadingSwap>
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};

export default ChatInput;
