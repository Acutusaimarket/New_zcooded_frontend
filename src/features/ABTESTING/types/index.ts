export interface Reference {
  id: string;
  collection: string;
}

export interface ABTestRequest {
  product_ids: string[];
  persona_id: string;
  sample_size?: number;
  context_layer?: string;
}

export interface ProductFitAnalysis {
  product_id: Reference;
  variant_name: string;

  // Core Scoring Metrics
  compatibility_score: number; // 0.0 - 1.0
  conversion_probability: number; // 0.0 - 1.0

  // Behavioral & Performance Metrics
  predicted_purchase_rate: number; // 0.0 - 1.0
  estimated_user_satisfaction: number; // 0.0 - 1.0
  predicted_return_probability: number; // 0.0 - 1.0
  expected_usage_frequency: string; // e.g., 'daily', 'weekly', etc.
  long_term_retention_score: number; // 0.0 - 1.0

  price_fit_score: number; // 0.0 - 1.0

  // Detailed Analysis
  strengths?: string[]; // Made optional as these may be missing in some responses
  weaknesses?: string[];
  reasoning?: string;

  // Granular Fit Scores
  engagement_potential: number; // 0.0 - 1.0
  usability_score: number; // 0.0 - 1.0
  feature_relevance: number; // 0.0 - 1.0

  // Additional Fit Dimensions
  emotional_appeal_score: number; // 0.0 - 1.0
  social_influence_score: number; // 0.0 - 1.0

  // Concerns & Improvements
  key_concerns?: string[];
  improvements?: string[];

  // Summary & Insights
  summary?: string;

  // --- MISSING FIELDS from @Untitled-1 (156-176) ---
  users_completing_purchase: number;
  users_leave_immediately: number;
  users_abandoning_at_each_stage: number;
  magnitude_difference_between_variants: number;
  total_exposed_users: number;
  percentage_difference_between_variants: number;
}

export interface StatisticalResults {
  winning_variant: string;
  p_value: number | null;
  confidence_interval: number[] | null;
  effect_size: number;
  is_significant: boolean;
  control_conversion_rate: number;
  treatment_conversion_rates: Record<string, number>;
}

export interface ABTestResult {
  _id: string;
  product_ids: Reference[];
  user_id: Reference;
  persona_id: Reference;
  product_fit_analysis: ProductFitAnalysis[];
  statistical_results: StatisticalResults;
  recommended_variant: Reference;
  sample_size: number;
  confidence_level: number;
  statistical_significance?: number;
  winner?: "variant_a" | "variant_b" | "inconclusive";
  recommendation?: string;
  updated_at: string;
  created_at: string;
}

export interface ABTestFormData {
  selectedProducts: string[];
  selectedPersona: string;
  environments: string[];
}

export interface ABTestStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface ProductVariant {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  product_type: "variant" | "product";
  color?: string;
  size?: string;
  features?: string[];
}
