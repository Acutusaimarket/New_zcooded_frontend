import React, { useState } from "react";

import { Check, Search, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { usePersonasListQuery } from "../../persona-management/api/query/use-personas-list.query";
import type { PersonasListParams } from "../../persona-management/types";

interface PersonaSelectionStepProps {
  selectedPersonas: string[];
  onPersonasChange: (personas: string[]) => void;
}

export const PersonaSelectionStep: React.FC<PersonaSelectionStepProps> = ({
  selectedPersonas,
  onPersonasChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PersonasListParams>({
    page: 1,
    per_page: 50,
    search: "",
    sort_by: "created_at",
    sort_order: "desc",
    status: "published",
  });

  const { data: personaData, isLoading, error } = usePersonasListQuery(filters);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePersonaToggle = (personaId: string) => {
    if (selectedPersonas.includes(personaId)) {
      onPersonasChange(selectedPersonas.filter((id) => id !== personaId));
    } else {
      onPersonasChange([...selectedPersonas, personaId]);
    }
  };

  const handleSelectAll = () => {
    if (personaData?.items) {
      const allPersonaIds = personaData.items.map((persona) => persona._id);
      onPersonasChange(allPersonaIds);
    }
  };

  const handleClearAll = () => {
    onPersonasChange([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="space-y-3 text-center">
          <div className="border-primary mx-auto h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground text-sm font-medium">
            Loading personas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive text-sm font-medium">
          Failed to load personas. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative max-w-lg flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search personas by name, category, or description..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-11 pr-4 pl-11 text-sm shadow-sm transition-all focus:shadow-md"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="min-w-[100px]"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={selectedPersonas.length === 0}
            className="min-w-[100px]"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Selected Count Banner */}
      {selectedPersonas.length > 0 && (
        <div className="bg-primary/10 border-primary/20 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <Users className="text-primary h-4 w-4" />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="text-primary text-sm font-semibold">
                {selectedPersonas.length} Persona
                {selectedPersonas.length !== 1 ? "s" : ""} Selected
              </p>
              <p className="text-muted-foreground text-xs">
                Ready to proceed with simulation
              </p>
            </div>
            <Badge variant="default" className="text-xs font-semibold">
              {selectedPersonas.length}
            </Badge>
          </div>
        </div>
      )}

      {/* Personas Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {personaData?.items?.map((persona) => {
          const isSelected = selectedPersonas.includes(persona._id);
          return (
            <Card
              key={persona._id}
              className={`group relative cursor-pointer overflow-hidden border transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 ring-primary/20 shadow-lg ring-2"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              }`}
              onClick={() => handlePersonaToggle(persona._id)}
            >
              {/* Selection Indicator Badge */}
              {isSelected && (
                <div className="bg-primary border-background absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-md">
                  <Check className="text-primary-foreground h-3.5 w-3.5" />
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle
                      className={`line-clamp-1 text-base font-semibold ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {persona.name}
                    </CardTitle>
                    {isSelected && (
                      <Sparkles className="text-primary h-3.5 w-3.5 flex-shrink-0" />
                    )}
                  </div>
                  {persona.persona_category && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {persona.persona_category}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 pt-0">
                {/* Description */}
                {persona.description && (
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                    {persona.description}
                  </p>
                )}

                {/* Demographic Info */}
                <div className="border-border/50 space-y-1.5 border-t pt-3">
                  {persona.demographic?.age_range && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium tracking-wide uppercase">
                        Age
                      </span>
                      <span className="text-foreground font-medium">
                        {persona.demographic.age_range}
                      </span>
                    </div>
                  )}
                  {persona.demographic?.location && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium tracking-wide uppercase">
                        Location
                      </span>
                      <span className="text-foreground truncate font-medium">
                        {persona.demographic.location}
                      </span>
                    </div>
                  )}
                  {persona.demographic?.occupation && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium tracking-wide uppercase">
                        Occupation
                      </span>
                      <span className="text-foreground truncate font-medium">
                        {persona.demographic.occupation}
                      </span>
                    </div>
                  )}
                </div>

                {/* Behavior Patterns */}
                {persona.behavior_patterns?.values &&
                  persona.behavior_patterns.values.length > 0 && (
                    <div className="border-border/50 mt-auto space-y-1.5 border-t pt-3">
                      <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Traits
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {persona.behavior_patterns.values
                          .slice(0, 2)
                          .map((value, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {value}
                            </Badge>
                          ))}
                        {persona.behavior_patterns.values.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            +{persona.behavior_patterns.values.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {personaData?.items?.length === 0 && (
        <div className="py-16 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Users className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-2 text-base font-semibold">
            No personas found
          </h3>
          <p className="text-muted-foreground text-sm">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No personas available at the moment"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {personaData?.pagination && personaData.pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 border-t pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={!personaData.pagination.has_previous}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
            }
            className="min-w-[100px]"
          >
            Previous
          </Button>
          <div className="text-muted-foreground flex items-center gap-2 px-4 text-sm">
            <span className="font-medium">
              Page {personaData.pagination.page}
            </span>
            <span>of</span>
            <span className="font-medium">
              {personaData.pagination.total_pages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!personaData.pagination.has_next}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
            }
            className="min-w-[100px]"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
