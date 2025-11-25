import type { CommonPaginationResponse } from "@/types/common.type";

// Media file structure for history
export interface MediaHistoryFile {
  media_id: string;
  media_type: string;
  media_url: string;
  s3_key: string;
  media_size: number;
}

// Persona demographic info
export interface HistoryPersonaDemographic {
  age_range: string;
  gender: string;
  occupation: string;
  income_tier: string;
  location: string;
  education: string;
}

// Participated persona structure
export interface HistoryParticipatedPersona {
  _id: string;
  name: string;
  persona_category: string;
  status: string;
  demographic: HistoryPersonaDemographic;
  created_at: string;
  updated_at: string;
}

// Participated product structure
export interface HistoryParticipatedProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  country: string;
  city: string;
}

// Main media history item
export interface MediaHistoryItem {
  _id: string;
  model_used: string;
  media_files: MediaHistoryFile[];
  participated_personas: HistoryParticipatedPersona[];
  participated_product: HistoryParticipatedProduct | null;
  created_at: string;
  updated_at: string;
  custom_questions?: string[];
  custom_questions_responses?: Record<string, string>;
}

// Query parameters for API calls
export interface MediaHistoryParams {
  page: number;
  page_size: number;
  sort_by: "createdAt" | "updatedAt";
  sort_order: "asc" | "desc";
}

// API response structure
export type MediaHistoryResponse = CommonPaginationResponse<MediaHistoryItem[]>;

// For URL query params with nuqs
export interface MediaHistorySearchParams {
  page: number;
  page_size: number;
  sort_by: "createdAt" | "updatedAt";
  sort_order: "asc" | "desc";
}

// Sort option for dropdown
export interface SortOption {
  value: "createdAt" | "updatedAt";
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
];

// Page size options
export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 20, label: "20 per page" },
  { value: 50, label: "50 per page" },
];

// Default query params
export const DEFAULT_MEDIA_HISTORY_PARAMS: MediaHistoryParams = {
  page: 1,
  page_size: 10,
  sort_by: "createdAt",
  sort_order: "desc",
};
