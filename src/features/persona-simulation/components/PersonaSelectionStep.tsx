import React, { useState } from "react";

import { ChevronDown, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  const handlePersonaSelect = (personaId: string) => {
    handlePersonaToggle(personaId);
    setIsSearchOpen(false);
  };

  const handleClearAll = () => {
    onPersonasChange([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="space-y-2 text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading personas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive">
          Failed to load personas. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex items-center justify-between space-x-4">
        <div className="max-w-md flex-1">
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isSearchOpen}
                className="w-full justify-between"
              >
                {searchTerm ? `Search: ${searchTerm}` : "Search personas..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search personas..."
                  value={searchTerm}
                  onValueChange={handleSearch}
                />
                <CommandList>
                  <CommandEmpty>No personas found.</CommandEmpty>
                  <CommandGroup>
                    {personaData?.items?.map((persona) => (
                      <CommandItem
                        key={persona._id}
                        value={persona.name}
                        onSelect={() => handlePersonaSelect(persona._id)}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={selectedPersonas.includes(persona._id)}
                          onChange={() => {}}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{persona.name}</div>
                          <div className="text-muted-foreground text-sm">
                            {persona.persona_category} •{" "}
                            {persona.demographic.age_range} •{" "}
                            {persona.demographic.location}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Selected Count */}
      <div className="flex items-center space-x-2">
        <Users className="text-primary h-4 w-4" />
        <span className="text-sm font-medium">
          {selectedPersonas.length} persona
          {selectedPersonas.length !== 1 ? "s" : ""} selected
        </span>
        {selectedPersonas.length > 0 && (
          <Badge variant="secondary">{selectedPersonas.length}</Badge>
        )}
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {personaData?.items?.map((persona) => (
          <Card
            key={persona._id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPersonas.includes(persona._id)
                ? "ring-primary bg-primary/5 ring-2"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handlePersonaToggle(persona._id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{persona.name}</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {persona.persona_category}
                  </p>
                </div>
                <Checkbox
                  checked={selectedPersonas.includes(persona._id)}
                  onChange={() => handlePersonaToggle(persona._id)}
                  className="ml-2"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {persona.description}
              </p>

              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-medium">Age:</span>
                  <span>{persona.demographic.age_range}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-medium">Location:</span>
                  <span>{persona.demographic.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-medium">Occupation:</span>
                  <span>{persona.demographic.occupation}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {persona.behavior_patterns.values
                  .slice(0, 3)
                  .map((value, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                {persona.behavior_patterns.values.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{persona.behavior_patterns.values.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {personaData?.items?.length === 0 && (
        <div className="py-8 text-center">
          <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">
            No personas found matching your criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {personaData?.pagination && personaData.pagination.total_pages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!personaData.pagination.has_previous}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
            }
          >
            Previous
          </Button>
          <span className="text-muted-foreground flex items-center px-3 text-sm">
            Page {personaData.pagination.page} of{" "}
            {personaData.pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!personaData.pagination.has_next}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
