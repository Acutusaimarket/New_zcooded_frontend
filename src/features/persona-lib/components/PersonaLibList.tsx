import React from "react";

import { AlertCircle, Users } from "lucide-react";

import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Skeleton } from "../../../components/ui/skeleton";
import type { PersonaLibItem } from "../types";
import { PersonaLibCard } from "./PersonaLibCard";
import { PersonaLibPagination } from "./PersonaLibPagination";

interface PersonaLibListProps {
  items: PersonaLibItem[];
  isLoading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
    total_count: number;
  };
}

export const PersonaLibList: React.FC<PersonaLibListProps> = ({
  items,
  isLoading,
  error,
  pagination,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load personas. Please try again later.
          {process.env.NODE_ENV === "development" && (
            <div className="mt-2 text-sm">Error: {error.message}</div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No personas found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or search terms to find what you're looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="text-sm text-gray-600">
        Found {pagination.total_count} persona
        {pagination.total_count !== 1 ? "s" : ""}
      </div>

      {/* Persona cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((persona) => (
          <PersonaLibCard key={persona._id} persona={persona} />
        ))}
      </div>

      {/* Pagination */}
      <PersonaLibPagination
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        totalCount={pagination.total_count}
        pageSize={pagination.page_size}
        hasNext={pagination.has_next}
        hasPrevious={pagination.has_previous}
      />
    </div>
  );
};
