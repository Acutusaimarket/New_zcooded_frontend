import type { ProductDocument } from "@/features/Product/types";
import type { PersonaData } from "@/types/persona.type";

// Base simulation history item from the list endpoint
export interface SimulationHistoryItem {
  _id: string;
  simulation_type: string;
  product_name: string;
  personas: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  product_details: {
    _id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    country: string;
    city: string;
  };
  model: string;
  created_at: string;
  updated_at: string;
}

// Detailed simulation data from the details endpoint
export interface SimulationDetails
  extends Omit<SimulationHistoryItem, "product_details"> {
  persona_results: PersonaResult[];
  summary: SimulationSummary;
  personas: PersonaData[];
  product_details: ProductDocument & {
    variants: ProductDocument[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context_layer?: Record<string, Array<Record<string, any>>>;
}
// Persona result from simulation
export interface PersonaResult {
  persona_id: string;
  result: {
    interest_level: number;
    purchase_intent: number;
    price_perception: "too high" | "too low" | "just right" | "reasonable";
    key_concerns: string[] | null;
    motivation_drivers: string[] | null;
    recommendation_likelihood: number | null;
    decision_timeline: string;
    summary: string | null;
    very_disappointed_responses: number; // float
    intending_to_stay: number; // float
    predicted_drop: number; // float
    users_likely_to_adopt: number; // float
    satisfaction: number; // float
    ease_of_use: number; // float
    personas_alligning_well: number;
    users_agreeing_problem_solution_fit: number; // float
    users_clearly_understanding_value: number; // float
    users_converting_from_trial: number;
    total_users_simulated: number; // float
    net_promoter_score: number; // percentage
    pmf_score: number; // percentage
    retention_intent: number; // percentage
    churn_probability: number; // percentage
    adoption_rate: number; // percentage
    satisfaction_score: number; // percentage
    usability_score: number; // percentage
    affinity_cluster_match_score: number; // percentage
    problem_solution_fit_score: number; // percentage
    value_proposition_clarity_score: number; // percentage
    trial_to_adoption_score: number; // percentage
    price_perception_score: number; // float
    pmf_index: number; // float
  };
}

// Simulation summary
export interface SimulationSummary {
  best_fit_personas: Array<{
    persona_id: string;
    persona_name: string;
    reason: string;
    other_insights: string[];
  }> | null;
  overall_recommendation: string;
  reason_to_reject: string;
  overall_summary: string;
  overall_interest_level: number;
  overall_purchase_intent: number;
  overall_price_perception:
    | "too high"
    | "too low"
    | "just right"
    | "reasonable";
  key_concerns: string[];
  custom_questions_responses?: Record<string, string>;
  overall_pmf_score: number; // percentage
  overall_trial_to_adoption_score: number; // percentage
  overall_value_proposition_clarity_score: number; // percentage
  overall_problem_solution_fit_score: number; // percentage
  overall_affinity_cluster_match_score: number; // percentage
  overall_usability_score: number; // percentage
  overall_satisfaction_score: number; // percentage
  overall_adoption_rate: number; // percentage
  overall_churn_probability: number; // percentage
  overall_retention_intent: number; // percentage
  price_perception_score: number; // float
  overall_pmf_index: number; // float
}

// API Response types
export interface SimulationHistoryResponse {
  data: SimulationHistoryItem[];
  message: string;
  success: boolean;
}

export interface SimulationDetailsResponse {
  data: SimulationDetails;
  message: string;
  success: boolean;
}

// Filter types
export interface SimulationFilters {
  simulation_type?: "overview" | "detailed" | null;
  date_from?: string | null;
  date_to?: string | null;
}

// URL query state types for nuqs
export interface SimulationQueryState {
  simulation_type: "overview" | "detailed" | null;
  date_from: string | null;
  date_to: string | null;
}
