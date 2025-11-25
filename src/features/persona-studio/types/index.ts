import type { PersonaData } from "@/types/persona.type";

export interface CreatePersonaResponse {
  success: boolean;
  message: string;
  data: PersonaData;
}

export interface PersonaStatsData {
  success: boolean;
  total_personas: number;
  personas_by_status: {
    draft: number;
    published: number;
  };
  personas_by_gender: Record<string, number>;
  personas_by_location: Record<string, number>;
  age_distribution: Record<string, number>;
  platform_stats: Record<string, number>;
  content_stats: Record<string, number>;
  traits_averages: Record<string, number>;
  created_this_month: number;
  created_this_week: number;
}
