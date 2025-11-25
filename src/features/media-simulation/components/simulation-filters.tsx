import React from "react";

import { RotateCcw, SortAsc, SortDesc } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { SORT_OPTIONS } from "../types/media-history.types";

interface SimulationFiltersProps {
  sortBy: "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
  onSortByChange: (sortBy: "createdAt" | "updatedAt") => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
  onClearFilters: () => void;
  className?: string;
}

export const SimulationFilters: React.FC<SimulationFiltersProps> = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  onClearFilters,
  className,
}) => {
  const isDefaultFilters = sortBy === "createdAt" && sortOrder === "desc";

  const handleSortOrderToggle = () => {
    onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {/* Sort By Dropdown */}
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select sort field" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortOrderToggle}
          className="flex items-center gap-2"
        >
          {sortOrder === "asc" ? (
            <>
              <SortAsc className="h-4 w-4" />
              Ascending
            </>
          ) : (
            <>
              <SortDesc className="h-4 w-4" />
              Descending
            </>
          )}
        </Button>
      </div>

      {/* Clear Filters */}
      {!isDefaultFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  );
};
