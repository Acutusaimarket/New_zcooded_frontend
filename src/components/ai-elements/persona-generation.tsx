"use client";

import type { ComponentProps, HTMLAttributes } from "react";
import { createContext, useContext } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Shimmer } from "./shimmer";

type PersonaGenerationContextValue = {
  isStreaming: boolean;
};

const PersonaGenerationContext =
  createContext<PersonaGenerationContextValue | null>(null);

const usePersonaGeneration = () => {
  const context = useContext(PersonaGenerationContext);
  if (!context) {
    throw new Error(
      "PersonaGeneration components must be used within PersonaGeneration"
    );
  }
  return context;
};

export type PersonaGenerationProps = HTMLAttributes<HTMLDivElement> & {
  isStreaming?: boolean;
};

export const PersonaGeneration = ({
  className,
  isStreaming = false,
  children,
  ...props
}: PersonaGenerationProps) => (
  <PersonaGenerationContext.Provider value={{ isStreaming }}>
    <div
      className={cn("space-y-4", className)}
      data-slot="persona-generation"
      {...props}
    >
      {children}
    </div>
  </PersonaGenerationContext.Provider>
);

export type PersonaGenerationHeaderProps = HTMLAttributes<HTMLDivElement>;

export const PersonaGenerationHeader = ({
  className,
  children,
  ...props
}: PersonaGenerationHeaderProps) => (
  <div
    className={cn("flex items-center justify-between border-b pb-3", className)}
    data-slot="persona-generation-header"
    {...props}
  >
    {children}
  </div>
);

export type PersonaGenerationTitleProps = Omit<
  HTMLAttributes<HTMLHeadingElement>,
  "children"
> & {
  children: string;
};

export const PersonaGenerationTitle = ({
  className,
  children,
  ...props
}: PersonaGenerationTitleProps) => {
  const { isStreaming } = usePersonaGeneration();

  return (
    <h3
      className={cn("text-lg font-semibold", className)}
      data-slot="persona-generation-title"
      {...props}
    >
      {isStreaming ? <Shimmer>{children}</Shimmer> : children}
    </h3>
  );
};

export type PersonaGenerationCountProps = HTMLAttributes<HTMLSpanElement> & {
  count: number;
};

export const PersonaGenerationCount = ({
  className,
  count,
  ...props
}: PersonaGenerationCountProps) => {
  const { isStreaming } = usePersonaGeneration();
  const displayText = `${count} persona(s)`;

  return (
    <span
      className={cn(
        "bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium",
        className
      )}
      data-slot="persona-generation-count"
      {...props}
    >
      {isStreaming ? <Shimmer>{displayText}</Shimmer> : displayText}
    </span>
  );
};

export type PersonaGenerationListProps = HTMLAttributes<HTMLDivElement>;

export const PersonaGenerationList = ({
  className,
  ...props
}: PersonaGenerationListProps) => (
  <div
    className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}
    data-slot="persona-generation-list"
    {...props}
  />
);

export type PersonaGenerationCardProps = ComponentProps<typeof Card> & {
  isLoading?: boolean;
};

export const PersonaGenerationCard = ({
  className,
  isLoading = false,
  children,
  ...props
}: PersonaGenerationCardProps) => {
  const { isStreaming } = usePersonaGeneration();

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        (isStreaming || isLoading) && "animate-pulse",
        className
      )}
      data-slot="persona-generation-card"
      {...props}
    >
      {children}
    </Card>
  );
};

export type PersonaGenerationCardHeaderProps = ComponentProps<
  typeof CardHeader
>;

export const PersonaGenerationCardHeader = ({
  className,
  ...props
}: PersonaGenerationCardHeaderProps) => (
  <CardHeader
    className={cn("pb-3", className)}
    data-slot="persona-generation-card-header"
    {...props}
  />
);

export type PersonaGenerationCardContentProps = ComponentProps<
  typeof CardContent
>;

export const PersonaGenerationCardContent = ({
  className,
  ...props
}: PersonaGenerationCardContentProps) => (
  <CardContent
    className={cn("space-y-3", className)}
    data-slot="persona-generation-card-content"
    {...props}
  />
);

export type PersonaGenerationFieldProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value?: string | number | string[];
  isLoading?: boolean;
};

export const PersonaGenerationField = ({
  label,
  value,
  isLoading = false,
  className,
  ...props
}: PersonaGenerationFieldProps) => {
  const { isStreaming } = usePersonaGeneration();
  const loading = isStreaming || isLoading;

  const displayValue = Array.isArray(value)
    ? value.join(", ")
    : String(value || "N/A");

  return (
    <div
      className={cn("text-sm", className)}
      data-slot="persona-generation-field"
      {...props}
    >
      <span className="text-muted-foreground font-medium">{label}:</span>{" "}
      {loading ? (
        <Shimmer className="inline-block">{displayValue}</Shimmer>
      ) : (
        <span className="text-foreground">{displayValue}</span>
      )}
    </div>
  );
};

export type PersonaGenerationBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: string;
  variant?: "default" | "draft" | "published";
};

export const PersonaGenerationBadge = ({
  className,
  children,
  variant = "default",
  ...props
}: PersonaGenerationBadgeProps) => {
  const { isStreaming } = usePersonaGeneration();

  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    draft: "bg-amber-100 text-amber-800",
    published: "bg-emerald-100 text-emerald-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      data-slot="persona-generation-badge"
      {...props}
    >
      {isStreaming ? <Shimmer>{children}</Shimmer> : children}
    </span>
  );
};
