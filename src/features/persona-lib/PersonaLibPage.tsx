import React from "react";

import { useGetPersonaLib } from "./api/query/use-get-persona-lib";
import { PersonaLibFilters } from "./components/PersonaLibFilters";
import { PersonaLibList } from "./components/PersonaLibList";
import { usePersonaLibQueryState } from "./hooks/usePersonaLibQueryState";

export const PersonaLibPage: React.FC = () => {
  const { getFilters } = usePersonaLibQueryState();
  const filters = getFilters();

  const { data, isLoading, error } = useGetPersonaLib(filters);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Persona Library
        </h1>
        <p className="text-gray-600">
          Browse and explore our comprehensive collection of user personas to
          understand your target audience better.
        </p>
      </div>

      {/* Filters */}
      <PersonaLibFilters />

      {/* Persona List */}
      <PersonaLibList
        items={data?.items || []}
        isLoading={isLoading}
        error={error}
        pagination={
          data?.pagination || {
            page: 1,
            page_size: 10,
            total_pages: 1,
            has_next: false,
            has_previous: false,
            total_count: 0,
          }
        }
      />
    </div>
  );
};
