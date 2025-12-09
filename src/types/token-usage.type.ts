export interface EnabledPlan {
  _id: string;
  name: string;
  plan_type: string;
  pricing: Array<{
    monthly: number;
    yearly: number;
    currency: string;
  }>;
  max_users: number;
  features: string[];
  credits: number;
  api_access: boolean;
  priority_support: boolean;
  no_of_parallel_simulations: number;
  has_restrictions: boolean;
  is_persona_generation_limited: boolean;
  is_media_simulation_limited: boolean;
  is_concept_simulation_limited: boolean;
  is_chat_simulation_limited: boolean;
  persona_count_limit: number | null;
  concept_count_limit: number | null;
  media_count_limit: number | null;
  chat_count_limit: number | null;
  created_at: string;
  updated_at: string;
}

export interface TokenUsageData {
  id: string;
  total_credits: number;
  credits_consumed: number;
  credits_remaining: number;
  enabled_plan: EnabledPlan;
}

export interface TokenUsageResponse {
  status: number;
  success: boolean;
  message: string;
  data: TokenUsageData;
}

