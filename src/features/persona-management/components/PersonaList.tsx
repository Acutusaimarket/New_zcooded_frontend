import { useCallback, useState } from "react";

import {
  ChevronDown,
  CloudIcon,
  FileUpIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSwap } from "@/components/shared/loading-swap";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSavePersonaMutation } from "@/features/persona-engine/api/mutation/use-save-persona";
import { useDebounce } from "@/hooks/use-debounce";
import type { PersonaData } from "@/types/persona.type";

import { useDeleteMultiplePersonasMutation } from "../api/mutation/use-delete-multiple-persona.mutation";
import { useDeletePersonaMutation } from "../api/mutation/use-delete-persona.mutation";
import { useDownloadPersonasMutation } from "../api/mutation/use-download-personas.mutation";
import { useUpdatePersonaMutation } from "../api/mutation/use-update-persona.mutation";
import { usePersonasListQuery } from "../api/query/use-personas-list.query";
import { usePersonaQueryState } from "../hooks/usePersonaQueryState";
import type { PersonaFormData } from "../schema";
import { PersonaCreateAndUpdate } from "./CreateAndUpdatePersonaDialog";
import { DownloadPersonasDialog } from "./DownloadPersonasDialog";
import { PersonaCard } from "./PersonaCard";
import { PersonaFilters } from "./PersonaFilters";

export const PersonaList = () => {
  // URL-based state management with custom hook
  const [queryState, setQueryState] = usePersonaQueryState();
  const deletePersonaMutation = useDeletePersonaMutation();
  const downloadPersonasMutation = useDownloadPersonasMutation();
  const bulkDeleteMutation = useDeleteMultiplePersonasMutation();
  const [selectedPersonasIds, setSelectedPersonasIds] = useState<string[]>([]);
  // const duplicatePersonaMutation = useDuplicatePersonaMutation();
  const [editPersona, setEditPersona] = useState<
    | {
        personaData: PersonaFormData;
        id: string;
      }
    | undefined
  >(undefined);
  const updatePersonaMutation = useUpdatePersonaMutation();
  const bulkPersonaUpdateMutation = useSavePersonaMutation();

  const debouncedSearch = useDebounce(queryState.search, 300);

  const { data, isLoading, error, ...personListQuery } = usePersonasListQuery({
    page: queryState.page,
    per_page: queryState.per_page,
    search: debouncedSearch,
    sort_by: queryState.sort_by,
    sort_order: queryState.sort_order,
    status: queryState.status !== "all" ? queryState.status : undefined,
    location: queryState.location || undefined,
    age_min: queryState.age_min ?? undefined,
    age_max: queryState.age_max ?? undefined,
    gender: queryState.gender !== "all" ? queryState.gender : undefined,
    metadata_id:
      queryState.metadata_id !== "all" ? queryState.metadata_id : undefined,
  });

  const handleEdit = (persona: PersonaData) => {
    const personaData: PersonaFormData = {
      persona_category: persona.persona_category,
      name: persona.name,
      description: persona.description,
      status: persona.status,
      demographic: {
        age_range: persona.demographic.age_range || "",
        gender: persona.demographic.gender || "",
        occupation: persona.demographic.occupation || "",
        income_tier: persona.demographic.income_tier || "",
        location: persona.demographic.location || "",
        education: persona.demographic.education || "",
      },
      behavior_patterns: {
        communication_style:
          persona.behavior_patterns.communication_style || "",
        response_tendency: persona.behavior_patterns.response_tendency || "",
        decision_making_process:
          persona.behavior_patterns.decision_making_process || "",
        lifestyle: persona.behavior_patterns.lifestyle || "",
        values: persona.behavior_patterns.values || [],
        purchasing_behavior:
          persona.behavior_patterns.purchasing_behavior || "",
        price_sensitivity: persona.behavior_patterns.price_sensitivity || "",
        media_consumption: persona.behavior_patterns.media_consumption || "",
      },
      traits: persona.traits || [],
      psychological_attributes: {
        personality_type:
          persona.psychological_attributes.personality_type || "",
        emotional_tendencies:
          persona.psychological_attributes.emotional_tendencies || "",
        cognitive_style: persona.psychological_attributes.cognitive_style || "",
        motivations: persona.psychological_attributes.motivations || [],
        fears: persona.psychological_attributes.fears || [],
        stress_triggers: persona.psychological_attributes.stress_triggers || [],
        coping_mechanisms:
          persona.psychological_attributes.coping_mechanisms || [],
        learning_style: persona.psychological_attributes.learning_style || "",
      },
    };
    setEditPersona({ personaData, id: persona._id });
  };

  const handleClosePersonaDialog = (open: boolean) => {
    if (queryState.create_persona_dialog) {
      setQueryState({ create_persona_dialog: open });
    } else {
      setEditPersona(undefined);
    }
  };

  const handleDelete = (personaId: string) => {
    // Find the persona to get its name for confirmation
    const persona = data?.items.find((p) => p._id === personaId);
    const personaName = persona?.name || "this persona";

    if (
      window.confirm(
        `Are you sure you want to delete "${personaName}"? This action cannot be undone.`
      )
    ) {
      deletePersonaMutation.mutate({ persona_id: personaId });
    }
  };

  const handleDownload = (persona: PersonaData) => {
    if (!persona.metadata) {
      toast.error("Cannot download: Persona has no metadata ID");
      return;
    }

    downloadPersonasMutation.mutate({ metadata_id: persona.metadata });
  };

  const handleUpdateStatusPersona = useCallback(
    (personaId: string, updatedData: Partial<PersonaData>) => {
      updatePersonaMutation.mutate({
        persona_id: personaId,
        data: {
          status: updatedData.status || "draft",
        },
      });
    },
    [updatePersonaMutation]
  );

  const handleSelectPersona = useCallback(
    (persona: PersonaData) => {
      const isSelected = selectedPersonasIds.includes(persona._id);
      const selectedPersonasId = isSelected
        ? selectedPersonasIds.filter((id) => id !== persona._id)
        : [...selectedPersonasIds, persona._id];
      setSelectedPersonasIds(selectedPersonasId);
    },
    [selectedPersonasIds]
  );

  const handleDeleteSelectedPersonas = useCallback(() => {
    if (selectedPersonasIds.length === 0) {
      toast.error("No personas selected");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedPersonasIds.length} selected personas? This action cannot be undone.`
      )
    ) {
      bulkDeleteMutation.mutate(selectedPersonasIds, {
        onSuccess: () => {
          personListQuery.refetch();
        },
        onError: (error) => {
          toast.error(`Error deleting personas: ${error.message}`);
        },
      });
      setSelectedPersonasIds([]);
    }
  }, [bulkDeleteMutation, personListQuery, selectedPersonasIds]);

  const handleSavePersona = useCallback(() => {
    if (selectedPersonasIds.length === 0) {
      toast.error("No personas selected");
      return;
    }
    bulkPersonaUpdateMutation.mutate(
      {
        personaIds: selectedPersonasIds,
        status: "published",
      },
      {
        onSuccess: () => {
          personListQuery.refetch();
        },
      }
    );
  }, [bulkPersonaUpdateMutation, personListQuery, selectedPersonasIds]);

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">Error loading personas: {error.message}</p>
        <Button
          variant="outline"
          onClick={() => personListQuery.refetch()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-2">
          <Button
            onClick={() => setQueryState({ create_persona_dialog: true })}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Persona
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <UploadIcon className="h-4 w-4" /> Import Persona{" "}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <UploadIcon className="mr-2 h-4 w-4" /> Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileUpIcon className="mr-2 h-4 w-4" /> Upload Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Filters */}
      <PersonaFilters
        onDownloadPersonas={() => setQueryState({ download_dialog: true })}
      />

      {/* persona select action */}
      {selectedPersonasIds.length > 0 && (
        <div className="fixed bottom-2 left-1/2 z-50 flex max-w-3xl items-center justify-center gap-4">
          <Button
            variant={"destructive"}
            onClick={handleDeleteSelectedPersonas}
          >
            <LoadingSwap
              className="flex items-center justify-center gap-1"
              isLoading={bulkDeleteMutation.isPending}
            >
              <TrashIcon />
              Delete Selected ({selectedPersonasIds.length})
            </LoadingSwap>
          </Button>
          <Button
            onClick={handleSavePersona}
            disabled={bulkPersonaUpdateMutation.isPending}
            className="bg-emerald-600 text-emerald-50 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LoadingSwap
              className="flex items-center justify-center gap-1"
              isLoading={bulkPersonaUpdateMutation.isPending}
            >
              <CloudIcon />
              Publish Selected ({selectedPersonasIds.length})
            </LoadingSwap>
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: queryState.per_page }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      )}

      {/* Personas grid */}
      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((persona) => (
              <PersonaCard
                key={persona._id}
                persona={persona}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onStatusChange={() =>
                  handleUpdateStatusPersona(persona._id, {
                    status: persona.status === "draft" ? "published" : "draft",
                  })
                }
                disabledActionButton={
                  deletePersonaMutation.isPending ||
                  updatePersonaMutation.isPending ||
                  bulkPersonaUpdateMutation.isPending ||
                  bulkDeleteMutation.isPending
                }
                onSelect={() => handleSelectPersona(persona)}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.total_pages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setQueryState({
                          page: Math.max(1, queryState.page - 1),
                        })
                      }
                      className={
                        queryState.page === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: Math.min(5, data.pagination.total_pages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setQueryState({ page })}
                            isActive={queryState.page === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  {data.pagination.total_pages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setQueryState({
                          page: Math.min(
                            data.pagination.total_pages,
                            queryState.page + 1
                          ),
                        })
                      }
                      className={
                        queryState.page === data.pagination.total_pages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Results info */}
          <div className="text-muted-foreground text-center text-sm">
            Showing {data.items.length} of {data.total_count} personas
            {data.pagination.total_pages > 1 &&
              ` (Page ${queryState.page} of ${data.pagination.total_pages})`}
          </div>
        </>
      )}

      {/* Empty state */}
      {data && data.items.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-lg">No personas found</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Try adjusting your search criteria or create a new persona
          </p>
        </div>
      )}

      <PersonaCreateAndUpdate
        key={editPersona?.id || "create-persona-dialog"}
        open={queryState.create_persona_dialog || !!editPersona?.id}
        onOpenChange={handleClosePersonaDialog}
        personaId={editPersona?.id}
        initialPersonaData={editPersona?.personaData}
      />

      {/* Download Dialog */}
      <DownloadPersonasDialog
        isOpen={queryState.download_dialog}
        onClose={() => setQueryState({ download_dialog: false })}
      />
    </div>
  );
};
