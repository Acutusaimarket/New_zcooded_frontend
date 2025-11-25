import type { CommonPaginationResponse } from "@/types/common.type";
import type { PersonaData } from "@/types/persona.type";

export type PersonasListResponse = CommonPaginationResponse<PersonaData[]>;

export interface PersonasListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: string;
  location?: string;
  age_min?: number;
  age_max?: number;
  gender?: string;
  metadata_id?: string;
}
