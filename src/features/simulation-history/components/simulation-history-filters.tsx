import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { TooltipWrapper } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useSimulationFilters } from "../hooks/use-simulation-filters";

export const SimulationHistoryFilters = () => {
  const {
    simulationType,
    dateFrom,
    dateTo,
    setSimulationType,
    setDateFrom,
    setDateTo,
    clearFilters,
  } = useSimulationFilters();

  const handleDateFromSelect = (date: Date | undefined) => {
    setDateFrom(date ? date.toISOString().split("T")[0] : null);
  };

  const handleDateToSelect = (date: Date | undefined) => {
    setDateTo(date ? date.toISOString().split("T")[0] : null);
  };

  const hasActiveFilters = simulationType || dateFrom || dateTo;

  return (
    <Card>
      <Collapsible className="bg-card rounded-lg border px-3 py-3">
        <TooltipWrapper
          triggerProps={{
            asChild: true,
          }}
          content="Filters"
        >
          <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between">
            <CardHeader className="p-0">
              <CardTitle className="text-base font-normal">
                Advanced Filters
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
        </TooltipWrapper>
        <CollapsibleContent>
          <CardContent className="grid grid-cols-2 gap-4 p-0 pt-3 md:grid-cols-3">
            {/* Simulation Type Filter */}
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-medium">Simulation Type</label>
              <Select
                value={simulationType || "all"}
                onValueChange={(value) =>
                  setSimulationType(
                    value === "all" ? null : (value as "overview" | "detailed")
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All simulation types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filters */}
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom
                        ? format(new Date(dateFrom), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom ? new Date(dateFrom) : undefined}
                      onSelect={handleDateFromSelect}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(new Date(dateTo), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo ? new Date(dateTo) : undefined}
                      onSelect={handleDateToSelect}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size={"sm"}
                onClick={clearFilters}
                className="ml-auto w-fit md:col-span-3"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
