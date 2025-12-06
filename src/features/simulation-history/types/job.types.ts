export interface IntermediateSteps {
  [key: string]: boolean;
}

export interface JobMetadata {
  user_email: string;
  no_of_simulations: number;
  num_personas: number;
  // Optional fields to support different job types
  num_media_files?: number;
  simulation_name?: string;
  product_name?: string;
  context_layer: unknown | null;
}

export interface SimulationJob {
  _id: string;
  job_type: string;
  status: "pending" | "in_progress" | "finalizing" | "completed" | "failed" | "interrupted";
  intermediate_steps: IntermediateSteps;
  meta_data: JobMetadata;
  failed_reasons: string | null;
  user: string;
  persona?: Array<{ name?: string; _id?: string; [key: string]: unknown }>;
  product?: Array<{ name?: string; _id?: string; [key: string]: unknown }>;
  created_at: string;
  updated_at: string;
}

export interface SimulationJobResponse {
  status: number;
  success: boolean;
  message: string;
  data: SimulationJob;
}

export interface SimulationJobsListResponse {
  status: number;
  success: boolean;
  message: string;
  data: SimulationJob[];
  pagination_metadata?: {
    total: number;
    page: number;
    page_size: number;
  };
}

