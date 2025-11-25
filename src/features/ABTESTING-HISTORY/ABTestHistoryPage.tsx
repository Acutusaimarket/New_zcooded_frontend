import React, { useState } from "react";

import { TestTube } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useABTestHistoryQuery } from "./api/ab-testing-history.api";
import { ABTestHistoryStats, ABTestHistoryTable } from "./components";
import type {
  ABTestHistoryFilters as ABTestHistoryFiltersType,
  ABTestHistoryResponse,
} from "./types";

export const ABTestHistoryPage: React.FC = () => {
  const [filters] = useState<ABTestHistoryFiltersType>({
    page: 1,
    per_page: 10,
  });

  // Use real API data
  const {
    data: historyData,
    isLoading,
    error,
  } = useABTestHistoryQuery(filters) as {
    data: ABTestHistoryResponse | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  // Debug the data structure
  // if (historyData) {
  //   console.log("Debug - Data Structure:", {
  //     hasData: !!historyData,
  //     dataKeys: Object.keys(historyData),
  //     items: historyData?.items,
  //     itemsLength: historyData?.items?.length,
  //     pagination: historyData?.pagination,
  //   });
  // }

  if (error) {
    return (
      <div className="container mx-auto min-h-screen bg-white p-6 dark:bg-[#0a0a0a]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TestTube className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                Failed to load A/B Test History
              </h3>
              <p className="text-muted-foreground mb-4">
                There was an error loading the test history. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto space-y-8">
        {/* Enhanced Stats */}
        <ABTestHistoryStats
          tests={historyData?.items || []}
          isLoading={isLoading}
        />

        {/* Enhanced Table */}
        {isLoading ? (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-blue-600" />
                <CardTitle>Loading Test History...</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 rounded-lg border p-4"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <ABTestHistoryTable
              tests={historyData?.items || []}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};
