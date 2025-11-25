import { useState } from "react";

import { ChevronDown, ChevronUp, Download, Filter, Search } from "lucide-react";

import UploadFileSelect from "@/components/shared/uploaded-file-select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePersonaQueryState } from "../hooks/usePersonaQueryState";

interface PersonaFiltersProps {
  // Download function
  onDownloadPersonas?: () => void;
}

export const PersonaFilters = ({ onDownloadPersonas }: PersonaFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [queryState, setQueryState] = usePersonaQueryState();

  return (
    <div className="space-y-4">
      {/* Basic Filters */}
      <div className="flex flex-1 gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name or title..."
            value={queryState.search}
            onChange={(e) => setQueryState({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        <Select
          value={queryState.status}
          onValueChange={(value) =>
            setQueryState({ status: value as "all" | "active" | "inactive" })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <UploadFileSelect
          onChange={(data) => setQueryState({ metadata_id: data?.id || "" })}
          defaultValue={queryState.metadata_id}
          className="max-w-40"
        />

        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filter
          {showAdvancedFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {onDownloadPersonas && (
          <Button
            variant="outline"
            onClick={onDownloadPersonas}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Personas
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <Collapsible
        open={showAdvancedFilters}
        onOpenChange={setShowAdvancedFilters}
      >
        <CollapsibleContent className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="mb-3 text-sm font-medium">Advanced Filters</h3>
            <div className="flex gap-4">
              {/* Sort By */}
              <Select
                value={queryState.sort_by}
                onValueChange={(value) => setQueryState({ sort_by: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="updated_at">Updated Date</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Select
                value={queryState.sort_order}
                onValueChange={(value) =>
                  setQueryState({ sort_order: value as "asc" | "desc" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>

              {/* Location */}
              <Input
                placeholder="Location..."
                value={queryState.location}
                onChange={(e) => setQueryState({ location: e.target.value })}
              />

              {/* Gender */}
              <Select
                value={queryState.gender}
                onValueChange={(value) =>
                  setQueryState({
                    gender: value as "all" | "male" | "female" | "other",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Age Min */}
              <Input
                type="number"
                placeholder="Min Age..."
                value={queryState.age_min}
                onChange={(e) =>
                  setQueryState({ age_min: parseInt(e.target.value, 10) })
                }
                min="0"
                max="100"
              />

              {/* Age Max */}
              <Input
                type="number"
                placeholder="Max Age..."
                value={queryState.age_max}
                onChange={(e) =>
                  setQueryState({ age_max: parseInt(e.target.value, 10) })
                }
                min="0"
                max="100"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
