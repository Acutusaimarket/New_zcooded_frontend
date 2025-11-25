import React from "react";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { usePersonaLibQueryState } from "../hooks/usePersonaLibQueryState";

export const PersonaLibFilters: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    gender,
    setGender,
    resetFilters,
  } = usePersonaLibQueryState();

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar - Always Visible */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Search personas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Collapsible Advanced Filters */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50">
          <span>Advanced Filters</span>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 space-y-4 rounded-md border border-gray-200 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Age Range */}
            <div className="space-y-2">
              <Label htmlFor="age-min">Age Min</Label>
              <Input
                id="age-min"
                type="number"
                placeholder="18"
                value={ageMin || ""}
                onChange={(e) =>
                  setAgeMin(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age-max">Age Max</Label>
              <Input
                id="age-max"
                type="number"
                placeholder="65"
                value={ageMax || ""}
                onChange={(e) =>
                  setAgeMax(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                placeholder="Enter gender..."
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Created At</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="updated_at">Updated At</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sort-order">Sort Order</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end border-t pt-4">
            <Button
              variant="outline"
              onClick={resetFilters}
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
