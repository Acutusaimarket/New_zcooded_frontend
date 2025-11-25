import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Check, Search, Users, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePersonasListQuery } from "@/features/persona-management/api/query/use-personas-list.query";
import type { PersonasListParams } from "@/features/persona-management/types";
import { cn } from "@/lib/utils";

interface PersonaSelectorProps {
  selectedPersonaIds: string[];
  onPersonaToggle: (personaId: string) => void;
  title?: string;
  description?: string;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersonaIds,
  onPersonaToggle,
  title = "Select Personas",
  description = "Choose one or more personas to simulate their interaction with your media content",
}) => {
  const [personaSearchTerm, setPersonaSearchTerm] = useState("");

  // Fetch personas
  const [personaFilters, setPersonaFilters] = useState<PersonasListParams>({
    page: 1,
    per_page: 50,
    search: "",
    sort_by: "created_at",
    sort_order: "desc",
    status: "published",
  });

  const { data: personaData, isLoading: isLoadingPersonas } =
    usePersonasListQuery(personaFilters);

  const personas = useMemo(() => personaData?.items || [], [personaData]);

  // Handle persona search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPersonaFilters((prev) => ({
        ...prev,
        search: personaSearchTerm,
        page: 1,
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [personaSearchTerm]);

  // Toggle persona selection
  const togglePersona = useCallback(
    (personaId: string) => {
      onPersonaToggle(personaId);
    },
    [onPersonaToggle]
  );

  // Memoize derived values to prevent unnecessary re-renders
  const selectedPersonas = useMemo(
    () => personas.filter((p) => selectedPersonaIds?.includes(p._id)),
    [personas, selectedPersonaIds]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search personas..."
            value={personaSearchTerm}
            onChange={(e) => setPersonaSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selected Personas */}
        {selectedPersonas.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">
              Selected Personas ({selectedPersonas.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedPersonas.map((persona) => (
                <Badge
                  key={persona._id}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  {persona.name}
                  <X
                    className="hover:text-destructive h-3 w-3 cursor-pointer"
                    onClick={() => togglePersona(persona._id)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Personas */}
        {isLoadingPersonas ? (
          <div className="flex items-center justify-center py-8">
            <div className="space-y-2 text-center">
              <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground">Loading personas...</p>
            </div>
          </div>
        ) : personas.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              No personas found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid max-h-80 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
            {personas.map((persona) => {
              const isSelected = selectedPersonaIds?.includes(persona._id);
              return (
                <div
                  key={persona._id}
                  className={cn(
                    "flex cursor-pointer items-start space-x-3 rounded-lg border p-3 transition-all hover:shadow-sm",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePersona(persona._id);
                  }}
                >
                  {/* Custom checkbox implementation */}
                  <div className="focus-visible:ring-ring relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border shadow focus-visible:ring-1 focus-visible:outline-none">
                    {isSelected && <Check className="text-primary h-3 w-3" />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="truncate font-medium">{persona.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      {persona.persona_category}
                    </p>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>{persona.demographic.age_range}</span>
                      <span>•</span>
                      <span>{persona.demographic.location}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {persona.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
