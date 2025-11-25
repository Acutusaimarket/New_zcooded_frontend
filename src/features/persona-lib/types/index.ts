export interface PersonaTrait {
  name: string;
  value: number;
  reason: string;
}

export interface PersonaDemographic {
  age_range: string;
  gender: string;
  occupation: string;
  income_tier: string;
  location: string;
  education: string;
}

export interface PersonaBehaviorPatterns {
  communication_style: string;
  response_tendency: string;
  decision_making_process: string;
  lifestyle: string;
  values: string[];
  purchasing_behavior: string;
  price_sensitivity: string;
  media_consumption: string;
}

export interface PersonaPsychologicalAttributes {
  personality_type: string;
  emotional_tendencies: string;
  cognitive_style: string;
  motivations: string[];
  fears: string[];
  stress_triggers: string[];
  coping_mechanisms: string[];
  learning_style: string;
}

export interface PersonaLibItem {
  persona_category: string;
  name: string;
  description: string;
  demographic: PersonaDemographic;
  behavior_patterns: PersonaBehaviorPatterns;
  traits: PersonaTrait[];
  psychological_attributes: PersonaPsychologicalAttributes;
  status: "draft" | "published" | "archived";
  _id: string;
  metadata: string;
  user: string;
  created_at: string;
  updated_at: string;
}

export interface PersonaLibPagination {
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  total_count: number;
}

export interface PersonaLibResponse {
  success: boolean;
  items: PersonaLibItem[];
  pagination: PersonaLibPagination;
  total_count: number;
}

export interface PersonaLibFilters {
  page: number;
  page_size: number;
  search?: string;
  sort_by: "created_at" | "name" | "updated_at";
  sort_order: "asc" | "desc";
  status?: "published" | "draft" | "archived";
  location?: string;
  age_min?: number;
  age_max?: number;
  gender?: string;
}
