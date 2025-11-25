import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

import type { PersonaLibFilters } from "../types";

/**
 * Custom hook for managing persona library URL query state
 * Used across PersonaLibList and PersonaLibFilters components
 */
export const usePersonaLibQueryState = () => {
  const [state, setState] = useQueryStates({
    // Search and filter states
    search: parseAsString
      .withOptions({
        throttleMs: 300, // Debounce search input
      })
      .withDefault(""),
    status: parseAsStringEnum(["published", "draft", "archived"]).withDefault(
      "published"
    ),
    location: parseAsString.withDefault(""),
    gender: parseAsString.withDefault(""),

    // Age filters
    age_min: parseAsInteger,
    age_max: parseAsInteger,

    // Sorting
    sort_by: parseAsStringEnum([
      "created_at",
      "name",
      "updated_at",
    ]).withDefault("created_at"),
    sort_order: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),

    // Pagination
    page: parseAsInteger.withDefault(1),
    page_size: parseAsInteger.withDefault(10),
  });

  const getFilters = (): PersonaLibFilters => ({
    page: state.page,
    page_size: state.page_size,
    search: state.search || undefined,
    sort_by: state.sort_by,
    sort_order: state.sort_order,
    status: state.status || undefined,
    location: state.location || undefined,
    age_min: state.age_min || undefined,
    age_max: state.age_max || undefined,
    gender: state.gender || undefined,
  });

  const resetFilters = () => {
    setState({
      page: 1,
      page_size: 10,
      search: "",
      sort_by: "created_at",
      sort_order: "desc",
      status: "published",
      location: "",
      age_min: null,
      age_max: null,
      gender: "",
    });
  };

  return {
    // State values
    page: state.page,
    pageSize: state.page_size,
    search: state.search,
    sortBy: state.sort_by,
    sortOrder: state.sort_order,
    status: state.status,
    location: state.location,
    ageMin: state.age_min,
    ageMax: state.age_max,
    gender: state.gender,

    // Setters
    setPage: (value: number) => setState({ page: value }),
    setPageSize: (value: number) => setState({ page_size: value }),
    setSearch: (value: string) => setState({ search: value }),
    setSortBy: (value: "created_at" | "name" | "updated_at") =>
      setState({ sort_by: value }),
    setSortOrder: (value: "asc" | "desc") => setState({ sort_order: value }),
    setStatus: (value: "published" | "draft" | "archived") =>
      setState({ status: value }),
    setLocation: (value: string) => setState({ location: value }),
    setAgeMin: (value: number | undefined) => setState({ age_min: value }),
    setAgeMax: (value: number | undefined) => setState({ age_max: value }),
    setGender: (value: string) => setState({ gender: value }),

    // Utilities
    getFilters,
    resetFilters,
  };
};
