import type { CommonPaginationResponse } from "./common.type";

export interface UploadAnalysisData {
  success: boolean;
  filename: string;
  id: string;
  analysis: {
    total_rows: number;
    total_columns: number;
    column_names: string[];
    column_types: Record<string, string>;
    sample_data: Record<string, string | number | null>[];
    unique_values: Record<string, string[] | number[] | string>;
    missing_values: Record<string, number>;
    id: string;
  };
}

export type MetadataDocT = {
  created_at: string;
  updated_at: string;
  persona_count: number;
  filename: string;
  file_size: number;
} & UploadAnalysisData["analysis"];

export type MetadataListResponse = CommonPaginationResponse<MetadataDocT[]>;
