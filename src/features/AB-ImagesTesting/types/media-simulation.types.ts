export interface MediaSimulationRequest {
  persona_ids: string[];
  product_id: string;
  media_files: File[];
  questions?: string[];
  simulation_type: "overview" | "detailed";
  model: string;
}

export interface MediaSimulationSummary {
  total_media_files: number;
  successful_analyses: number;
  failed_analyses: number;
  personas_used: number;
  product_included: string;
  simulation_type: "overview" | "detailed";
  model_used: string;
  custom_questions: number;
}

export interface PersonaDemographic {
  age_range: string;
  gender: string;
  location: string;
}

export interface PersonaContext {
  id: string;
  name: string;
  category: string;
  description: string;
  demographic: PersonaDemographic;
}

export interface ProductContext {
  id: string;
  name: string;
  category: string;
  description: string;
  brand: string;
  price_range: string;
}

export interface ContextMetadata {
  personas: PersonaContext[];
  product: ProductContext;
}

export interface MediaSimulationResponse {
  status: "success" | "error";
  summary: MediaSimulationSummary;
  analyses: Array<Record<string, unknown>>;
  context_metadata: ContextMetadata;
  warnings: string[];
  summarized_output: Record<string, unknown>;
  comparison: Record<string, unknown>;
}

export interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
  size: number;
  name: string;
}

export interface MediaSimulationFormData {
  persona_ids: string[];
  product_id: string;
  questions: string[];
  simulation_type: "overview" | "detailed";
  model: string;
  media_files: File[];
}

export interface PersonaOption {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface ModelOption {
  value: string;
  label: string;
  description?: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    value: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    description: "Fast and efficient analysis",
  },
  {
    value: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    description: "Advanced reasoning capabilities",
  },
  {
    value: "gpt-4o",
    label: "GPT-4o",
    description: "Comprehensive analysis",
  },
];

export const SIMULATION_TYPES = [
  {
    value: "overview",
    label: "Overview",
    description: "Quick analysis with key insights",
  },
  {
    value: "detailed",
    label: "Detailed",
    description: "Comprehensive analysis with in-depth insights",
  },
] as const;
