import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

/**
 * Custom hook for managing persona-related URL query state
 * Used across PersonaList and PersonaFilters components
 */
export const usePersonaQueryState = () => {
  return useQueryStates({
    // Filter states
    search: parseAsString
      .withOptions({
        throttleMs: 300, // Debounce search input
      })
      .withDefault(""),
    status: parseAsStringEnum(["all", "active", "inactive"]).withDefault("all"),
    metadata_id: parseAsString.withDefault(""),

    // Advanced filter states
    sort_by: parseAsString.withDefault(""),
    sort_order: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
    location: parseAsString.withDefault(""),
    age_min: parseAsInteger.withDefault(0),
    age_max: parseAsInteger.withDefault(120),
    gender: parseAsStringEnum(["all", "male", "female", "other"]).withDefault(
      "all"
    ),

    // Pagination
    page: parseAsInteger.withDefault(1),
    per_page: parseAsInteger.withDefault(14),

    // Dialog states
    download_dialog: parseAsBoolean.withDefault(false),
    create_persona_dialog: parseAsBoolean.withDefault(false),
  });
};
