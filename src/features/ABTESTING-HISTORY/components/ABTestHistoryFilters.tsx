import React, { useState } from "react";

import { Calendar, Filter, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { ABTestHistoryFilters as ABTestHistoryFiltersType } from "../types";

interface ABTestHistoryFiltersProps {
  filters: ABTestHistoryFiltersType;
  onFiltersChange: (filters: ABTestHistoryFiltersType) => void;
}

export const ABTestHistoryFilters: React.FC<ABTestHistoryFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<{
    start_date?: string;
    end_date?: string;
  }>({});

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status:
        status === "all"
          ? undefined
          : (status as ABTestHistoryFiltersType["status"]),
    });
  };

  const handleDateRangeApply = () => {
    onFiltersChange({
      ...filters,
      date_range:
        tempDateRange.start_date && tempDateRange.end_date
          ? {
              start_date: tempDateRange.start_date,
              end_date: tempDateRange.end_date,
            }
          : undefined,
    });
    setIsCalendarOpen(false);
  };

  const handleDateRangeClear = () => {
    setTempDateRange({});
    onFiltersChange({
      ...filters,
      date_range: undefined,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      page: 1,
      per_page: 10,
    });
    setTempDateRange({});
  };

  const hasActiveFilters =
    filters.status ||
    filters.search ||
    filters.date_range?.start_date ||
    filters.date_range?.end_date;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Tests</Label>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="search"
                placeholder="Search by test name or ID..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.date_range && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.date_range?.start_date &&
                  filters.date_range?.end_date
                    ? `${filters.date_range.start_date} - ${filters.date_range.end_date}`
                    : "Select date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={tempDateRange.start_date || ""}
                        onChange={(e) =>
                          setTempDateRange((prev) => ({
                            ...prev,
                            start_date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={tempDateRange.end_date || ""}
                        onChange={(e) =>
                          setTempDateRange((prev) => ({
                            ...prev,
                            end_date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleDateRangeApply}>
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDateRangeClear}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleStatusChange("all")}
                />
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleSearchChange("")}
                />
              </Badge>
            )}
            {filters.date_range?.start_date && filters.date_range?.end_date && (
              <Badge variant="secondary" className="gap-1">
                Date: {filters.date_range.start_date} -{" "}
                {filters.date_range.end_date}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={handleDateRangeClear}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
