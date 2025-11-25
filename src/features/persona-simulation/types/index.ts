export interface SimulationRequest {
  persona_ids: string[];
  product_id: string;
  simulation_type: "overview" | "detailed";
  model: "gpt-4o" | "gpt-5";
  questions: string[];
  no_of_simulations: number;
  context_layer: string;
}

export interface PersonaResult {
  persona_id: string;
  result: {
    interest_level: number;
    purchase_intent: number;
    price_perception: "too high" | "too low" | "just right";
    key_concerns: string[] | null;
    motivation_drivers: string[] | null;
    recommendation_likelihood: number | null;
    decision_timeline: string;
    summary: string | null;
    price_perception_score: number;
    pmf_index: number;
  };
}

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
  overall_price_perception: "too high" | "too low" | "just right";
  key_concerns: string[];
  price_perception_score: number;
  overall_pmf_index: number;
}

export interface SimulationResponse {
  data: {
    product_id: string;
    participated_persona_ids: string[];
    product_name: string;
    simulation_type: string;
    persona_results: PersonaResult[];
    summary: SimulationSummary;
  };
  message: string;
  success: boolean;
}

export interface SimulationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface SimulationFormData {
  selectedPersonas: string[];
  selectedProduct: string;
  simulationType: "overview" | "detailed";
  model: "gpt-4o" | "gpt-5";
  questions: string[];
  noOfSimulations: number;
  contextLayer: string;
}

export interface AvailableModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface MarketFitSimulationResponse {
  status: number;
  success: boolean;
  message: string;
  data: MarketFitSimulationPayload;
}

export interface MarketFitSimulationPayload {
  simulation_analysis: {
    metadata: MarketFitSimulationMetadata;
    kpi_summary: MarketFitKpiSummary[];
  };
  recommendation: MarketFitRecommendation;
  s3_keys: MarketFitAttachment[];
}

export interface MarketFitSimulationMetadata {
  generated_at: string;
  total_responses: number;
  numeric_responses: number;
  excluded_kpis: string[];
  unique_agents: number;
  unique_kpis: number;
  num_questions: number;
}

export interface MarketFitKpiSummary {
  kpi_metric: string;
  metric_type: string;
  num_responses: number;
  total_response: number;
  average_response: number;
  std_dev: number;
  min_response: number;
  max_response: number;
}

export interface MarketFitRecommendation {
  segment_analysis: MarketFitSegmentAnalysis[];
  critical_issues: MarketFitCriticalIssue[];
  product_modification: MarketFitProductModification[];
  value_proposition_rewrite: MarketFitValuePropRewrite[];
}

export interface MarketFitSegmentAnalysis {
  segment_name: string;
  segment_size: string;
  fit_level: string;
  key_characteristics: {
    demographics: string[];
    behaviors: string[];
    pain_points: string[];
  };
  strengths: string[];
  weaknesses: string[];
  specific_recommendations: MarketFitSegmentRecommendation[];
  acquisition_channels: string[];
}

export interface MarketFitSegmentRecommendation {
  category: string;
  priority: "High" | "Medium" | "Low" | string;
  recommendation: string;
  rationale: string;
}

export interface MarketFitCriticalIssue {
  category: string;
  severity: string;
  title: string;
  description: string;
  affected_segments: string[];
  business_impact: string;
  recommendations: string;
  quick_win: boolean;
}

export interface MarketFitProductModification {
  modification_area: string;
  current_state: string;
  recommended_state: string;
  justification: string;
}

export interface MarketFitValuePropRewrite {
  current_messaging: string;
  recommendation_by_segment: Array<{
    segment_name: string;
    primary_hook: string;
    key_messages_to_add: string[];
  }>;
}

export interface MarketFitAttachment {
  key: string;
  url: string;
  file_name: string;
  content_type: string;
}
