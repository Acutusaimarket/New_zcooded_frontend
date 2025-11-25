import React from "react";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

import { SimulationFilters } from "./components/simulation-filters";
import { SimulationGrid } from "./components/simulation-grid";
import { SimulationPagination } from "./components/simulation-pagination";
import { useMediaHistoryWithParams } from "./hooks/use-media-history";

export const MediaHistoryPage: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    params,
    updateSort,
    updateSortOrder,
    updatePage,
    updatePageSize,
    resetFilters,
  } = useMediaHistoryWithParams();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media History</h1>
          <p className="text-muted-foreground">
            Browse and manage your media simulation history
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div>
        {/* <CardTitle className="text-lg">Filters & Sorting</CardTitle> */}
        <CardContent className="flex justify-end p-0">
          <SimulationFilters
            sortBy={params.sort_by}
            sortOrder={params.sort_order}
            onSortByChange={updateSort}
            onSortOrderChange={updateSortOrder}
            onClearFilters={resetFilters}
          />
        </CardContent>
      </div>

      {/* <Separator /> */}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Simulation Grid */}
        <SimulationGrid
          simulations={data?.items}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={handleRefresh}
        />

        {/* Pagination */}
        {data && !isLoading && !isError && data.items.length > 0 && (
          <SimulationPagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.total_pages}
            totalCount={data.total_count}
            pageSize={data.pagination.page_size}
            hasNext={data.pagination.has_next}
            hasPrevious={data.pagination.has_previous}
            onPageChange={updatePage}
            onPageSizeChange={updatePageSize}
          />
        )}
      </div>
    </div>
  );
};
