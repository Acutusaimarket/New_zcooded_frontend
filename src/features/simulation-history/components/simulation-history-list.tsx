import { RefreshCw } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useSimulationHistory } from "../api";
import { useSimulationFilters } from "../hooks/use-simulation-filters";
import { SimulationCard } from "./simulation-card";

export const SimulationHistoryList = () => {
  const { getFilters } = useSimulationFilters();
  const filters = getFilters();

  const { data, isLoading, error, isError, refetch } =
    useSimulationHistory(filters);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Simulation Cards Skeleton */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="ml-auto h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>
              {error?.message ||
                "Failed to load simulation history. Please try again."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="bg-muted mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
              <svg
                className="text-muted-foreground h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-muted-foreground mb-2 text-xl font-semibold">
              {hasActiveFilters
                ? "No simulations match your filters"
                : "No simulations yet"}
            </h3>
            <p className="text-muted-foreground mx-auto mb-6 max-w-md">
              {hasActiveFilters
                ? "Try adjusting your search criteria or clear the filters to see all simulations."
                : "Start by creating your first simulation to see results and insights here."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-7 space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm font-medium">
            Active filters:
          </span>
          {filters.simulation_type && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.simulation_type}
            </Badge>
          )}
          {filters.date_from && (
            <Badge variant="secondary" className="gap-1">
              From: {new Date(filters.date_from).toLocaleDateString()}
            </Badge>
          )}
          {filters.date_to && (
            <Badge variant="secondary" className="gap-1">
              To: {new Date(filters.date_to).toLocaleDateString()}
            </Badge>
          )}
        </div>
      )}

      {/* Simulation Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {data.data.map((simulation) => (
          <SimulationCard key={simulation._id} simulation={simulation} />
        ))}
      </div>
    </div>
  );
};
