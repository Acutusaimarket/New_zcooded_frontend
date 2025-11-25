import React from "react";

import { AlertCircle, RotateCcw, Search } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { MediaHistoryItem } from "../types/media-history.types";
import { SimulationCard } from "./simulation-card";

interface SimulationGridProps {
  simulations?: MediaHistoryItem[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

// Loading skeleton for simulation cards
const SimulationCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Media Section Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-8" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Persona Section Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="bg-muted space-y-2 rounded-md p-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>

        {/* Product Section Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="bg-muted space-y-2 rounded-md p-3">
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

// Empty state component
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Search className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No simulations found</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        No media simulations have been created yet. Start by running your first
        simulation to see results here.
      </p>
    </div>
  );
};

// Error state component
const ErrorState = ({
  error,
  onRetry,
}: {
  error?: Error | null;
  onRetry?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-4">
          <div>
            <p className="font-semibold">Failed to load simulations</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
          </div>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="self-start"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const SimulationGrid: React.FC<SimulationGridProps> = ({
  simulations = [],
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
  className,
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <SimulationCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className={cn("", className)}>
        <ErrorState error={error} onRetry={onRetry} />
      </div>
    );
  }

  // Show empty state
  if (!simulations.length) {
    return (
      <div className={cn("", className)}>
        <EmptyState />
      </div>
    );
  }

  // Show simulation cards
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {simulations.map((simulation) => (
        <SimulationCard key={simulation._id} simulation={simulation} />
      ))}
    </div>
  );
};
