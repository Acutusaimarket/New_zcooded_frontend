// Export main page component
export { MediaHistoryPage } from "./page";

// Export individual components
export { SimulationCard } from "./components/simulation-card";
export { SimulationFilters } from "./components/simulation-filters";
export { SimulationGrid } from "./components/simulation-grid";
export { SimulationPagination } from "./components/simulation-pagination";

// Export hooks
export {
  useMediaHistory,
  useMediaHistoryParams,
  useMediaHistoryWithParams,
} from "./hooks/use-media-history";

// Export types
export type {
  HistoryParticipatedPersona,
  HistoryParticipatedProduct,
  MediaHistoryFile,
  MediaHistoryItem,
  MediaHistoryParams,
  MediaHistoryResponse,
  MediaHistorySearchParams,
  SortOption,
} from "./types/media-history.types";

// Export API functions
export { fetchMediaHistory, mediaHistoryKeys } from "./lib/media-history-api";
