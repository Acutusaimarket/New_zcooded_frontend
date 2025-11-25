import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsStringLiteral, useQueryStates } from "nuqs";

import { fetchMediaHistory, mediaHistoryKeys } from "../lib/media-history-api";
import type {
  MediaHistoryParams,
  MediaHistorySearchParams,
} from "../types/media-history.types";

// URL query parameters parsers for nuqs
const searchParams = {
  page: parseAsInteger.withDefault(1),
  page_size: parseAsInteger.withDefault(10),
  sort_by: parseAsStringLiteral(["createdAt", "updatedAt"]).withDefault(
    "createdAt"
  ),
  sort_order: parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
};

// Hook for managing URL query parameters with nuqs
export const useMediaHistoryParams = () => {
  const [params, setParams] = useQueryStates(searchParams, {
    history: "push",
    shallow: false,
    clearOnDefault: true,
  });

  return {
    params: params as MediaHistorySearchParams,
    setParams,
    updatePage: (page: number) => setParams({ page }),
    updatePageSize: (page_size: number) => setParams({ page_size, page: 1 }),
    updateSort: (sort_by: "createdAt" | "updatedAt") =>
      setParams({ sort_by, page: 1 }),
    updateSortOrder: (sort_order: "asc" | "desc") =>
      setParams({ sort_order, page: 1 }),
    resetFilters: () =>
      setParams({
        page: 1,
        page_size: 10,
        sort_by: "createdAt",
        sort_order: "desc",
      }),
  };
};

// Main hook for fetching media history with React Query
export const useMediaHistory = (params: MediaHistoryParams) => {
  return useQuery({
    queryKey: mediaHistoryKeys.list(params),
    queryFn: async () => {
      // console.log("Fetching media history with params:", params);
      const result = await fetchMediaHistory(params);
      // console.log("Media history API response:", result);
      return result;
    },
    retry: 2,
  });
};

// Combined hook that uses both URL state and data fetching
export const useMediaHistoryWithParams = () => {
  const { params, ...paramHelpers } = useMediaHistoryParams();
  const query = useMediaHistory(params);

  return {
    ...query,
    params,
    ...paramHelpers,
  };
};
