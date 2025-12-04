export interface MediaSimulationRequest {
  persona_ids: string[];
  product_id: string;
  media_files: File[];
  questions?: string[];
  simulation_type: "overview" | "detailed";
  model: string;
}

// New API Response Structure
export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

// KPI Metrics for individual analysis
export interface KPIMetrics {
  engagement_potential: number;
  message_clarity: number;
  emotional_impact: number;
  brand_consistency: number;
  conversion_potential: number;
  production_quality: number;
  relevance_score: number;
  overall_effectiveness: number;
}

// Insights structure
export interface AnalysisInsights {
  key_strengths: string[];
  key_concerns: string[];
  positive_aspects: string[];
  negative_aspects: string[];
  recommendations: string[];
}

// Media metadata
export interface MediaMetadata {
  file_size: number;
  file_name: string;
  content_type: string;
}

// Individual analysis structure
export interface IndividualAnalysis {
  kpi_metrics: KPIMetrics;
  insights: AnalysisInsights;
  executive_summary: string;
  target_audience_fit: string;
  campaign_suitability: string[];
  risk_assessment: string;
  product_alignment: number;
  persona_resonance: number;
  analysis_id: string;
  persona_id: string;
  media_id: string;
  product_id: string;
  timestamp: string;
  media_type: "image" | "video";
  metadata: MediaMetadata;
  custom_questions_responses?: Record<string, string>;
}

// KPI comparison matrix
export interface KPIComparisonMatrix {
  analysis_id: string;
  kpi_scores: KPIMetrics;
}

// Ranking structure
export interface AnalysisRanking {
  rank: number;
  analysis_id: string;
  justification: string;
}

// Strengths and weaknesses
export interface StrengthsWeaknesses {
  analysis_id: string;
  strengths: string[];
  weaknesses: string[];
}

// Persona recommendations
export interface PersonaRecommendation {
  persona_id: string;
  media_id: string;
  reason: string;
}

// Final recommendation
export interface FinalRecommendation {
  analysis_id: string;
  rationale: string;
  expected_outcomes: string[];
}

// Risk factors
export interface RiskFactor {
  analysis_id: string;
  risks: string[];
  risk_level: "Low" | "Medium" | "High";
}

// Media recommendations
export interface MediaRecommendation {
  media_id: string;
  rationale: string;
}

// Comparison structure
export interface ComparisonData {
  kpi_comparison_matrix: KPIComparisonMatrix[];
  ranking: AnalysisRanking[];
  strengths_weaknesses: StrengthsWeaknesses[];
  persona_recommendations: PersonaRecommendation[];
  product_alignment: string;
  final_recommendation: FinalRecommendation;
  risk_factors: RiskFactor[];
  confidence_score: number;
  media_recommendations: MediaRecommendation[];
}

// Primary recommendations
export interface PrimaryRecommendation {
  media_id: string;
  analysis_id: string;
  overall_score: number;
  persona_match: string;
  selection_rationale: string[];
  confidence_score: number;
}

// Persona specific insights
export interface PersonaSpecificInsight {
  persona_id: string;
  best_performing_media: string;
  key_messaging_opportunities: string[];
  content_gaps: string[];
  recommended_improvements: string[];
}

// Performance matrix
export interface PerformanceMatrix {
  high_performers: string[];
  moderate_performers: string[];
  underperformers: string[];
}

// Strategic recommendations
export interface StrategicRecommendations {
  campaign_focus: string;
  content_optimization: string[];
  risk_mitigation: string[];
  messaging_themes: string[];
  target_audience_priorities: string[];
}

// Execution priorities
export interface ExecutionPriorities {
  immediate_use: string[];
  needs_modification: string[];
  avoid_usage: string[];
  ab_testing_opportunities: string[];
  production_priorities: string[];
}

// Quality metrics
export interface QualityMetrics {
  average_effectiveness_score: number;
  recommendation_confidence: number;
  coverage_score: number;
  alignment_score: number;
}

// Additional insights
export interface AdditionalInsights {
  surprising_findings: string[];
  market_opportunities: string[];
  competitive_advantages: string[];
  scalability_factors: string[];
}

// Media recommendations structure
export interface MediaRecommendationsData {
  primary_recommendations: PrimaryRecommendation[];
  persona_specific_insights: PersonaSpecificInsight[];
  performance_matrix: PerformanceMatrix;
  strategic_recommendations: StrategicRecommendations;
  execution_priorities: ExecutionPriorities;
  quality_metrics: QualityMetrics;
  additional_insights: AdditionalInsights;
  total_media_analyzed: number;
  recommendation_version: string;
}

// Persona demographic (updated)
export interface PersonaDemographic {
  age_range: string;
  gender: string;
  occupation: string;
  income_tier: string;
  location: string;
  education: string;
}

// Behavior patterns
export interface BehaviorPatterns {
  communication_style: string;
  response_tendency: string;
  decision_making_process: string;
  lifestyle: string;
  values: string[];
  purchasing_behavior: string;
  price_sensitivity: string;
  media_consumption: string;
}

// Persona traits
export interface PersonaTrait {
  name: string;
  value: number;
  reason: string;
}

// Psychological attributes
export interface PsychologicalAttributes {
  personality_type: string;
  emotional_tendencies: string;
  cognitive_style: string;
  motivations: string[];
  fears: string[];
  stress_triggers: string[];
  coping_mechanisms: string[];
  learning_style: string;
}

// Updated persona structure
export interface ParticipatedPersona {
  persona_category: string;
  name: string;
  description: string;
  demographic: PersonaDemographic;
  behavior_patterns: BehaviorPatterns;
  traits: PersonaTrait[];
  psychological_attributes: PsychologicalAttributes;
  status: string;
  _id: string;
  metadata: string;
  user: string;
  created_at: string;
  updated_at: string;
}

// Product info structure
export interface ProductInfo {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  country: string;
  city: string;
  images: string[];
  features: string[];
  specification: {
    battery: string;
    storage: string;
    ram: string;
  };
  color: string;
  size: string;
  weight: number;
  metadata: {
    warranty: string;
    brand: string;
    model: string;
  };
  user: {
    id: string;
    collection: string;
  };
  parent: null;
  product_type: string;
  created_at: string;
  updated_at: string;
}

// Main data structure
export interface MediaSimulationData {
  id: string;
  individual_analysis: IndividualAnalysis[];
  comparison: ComparisonData;
  media_recommendations: MediaRecommendationsData;
  participated_personas: ParticipatedPersona[];
  product_info: ProductInfo;
  custom_questions?: string[];
  custom_questions_responses?: Record<string, string>;
}
// Updated response structure
export interface MediaSimulationResponse
  extends ApiResponse<MediaSimulationData> {
  // Add at least one member to avoid lint error
  data: MediaSimulationData;
}

// Legacy interfaces for backward compatibility
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

export interface MediaAnalysis {
  media_id: string;
  media_name: string;
  persona_responses: Record<string, string | number | boolean>;
  insights: string[];
  sentiment_score?: number;
  engagement_metrics?: Record<string, number>;
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
  // product_id: string;
  questions: string[];
  environment_names: string[];
  simulation_type: "overview" | "detailed";
  model: string;
  media_files: File[];
}

// Available options for form dropdowns
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

// New API Response Structure for /media/run/new endpoint
export interface KPISummaryItem {
  kpi_metric: string;
  metric_type: string;
  num_responses: number | null;
  total_response: number | null;
  average_response: number | null;
  std_dev: number | null;
  min_response: number | null;
  max_response: number | null;
}

export interface SimulationAnalysis {
  kpi_summary?: KPISummaryItem[];
  recommendation?: RecommendationData;
  visual_analysis?: VisualAnalysis[];
  question_bank?: QuestionBankItem[];
  s3_keys?: S3Key[];
}

export interface ScriptRewrite {
  current_hook?: string;
  recommended_hook?: string;
  key_messages_to_add?: string[];
}

export interface SpecificChanges {
  visuals?: {
    add?: string[];
    remove?: string[];
    modify?: string[];
  };
  script_rewrite?: ScriptRewrite;
  audio_modifications?: {
    voiceover_tone?: string;
    background_music?: string;
  };
  opening_frame?: string;
  disclaimer_addition?: string;
  platform_optimization?: string;
  video_structure?: Array<{
    timestamp: string;
    content: string;
  }>;
  trust_indicators_to_add?: string[];
}

export interface ExpectedImpact {
  metric_name: string;
  expected_change: string;
  confidence_level: string;
}

export interface MediaFileModification {
  modification_area?: string;
  current_state?: string;
  recommended_state?: string;
  justification?: string;
  expected_impact?: ExpectedImpact[];
  specific_changes?: SpecificChanges;
}

export interface AlternativeStrategy {
  scenario?: string;
  recommendation?: string;
  targeting_refinements?: {
    negative_audience_exclusions?: string[];
    positive_targeting?: Record<string, unknown>;
  };
  justification?: string;
}

export interface ImplementationRoadmap {
  immediate_actions?: string[];
  short_term_modifications?: string[];
  medium_term_validation?: string[];
}

export interface SimulationInsights {
  key_metrics_breakdown?: Record<string, {
    high_scorers_rationale?: string;
    low_scorers_rationale?: string;
    blocker_1?: string;
    blocker_2?: string;
    blocker_3?: string;
    concern?: string;
    root_cause?: string;
  }>;
  persona_dissonance_analysis?: {
    explanation?: string;
    insight?: string;
    recommendation?: string;
  };
}

export interface RecommendationData {
  media_file_modifications?: MediaFileModification[];
  alternative_strategy?: AlternativeStrategy;
  implementation_roadmap?: ImplementationRoadmap;
  simulation_insights?: SimulationInsights;
}

export interface VisualAnalysis {
  summary?: string;
  category?: string;
  content_type?: string;
  detailed_description?: string;
  entities?: Array<{
    name: string;
    category: string;
    confidence: number;
    description: string;
  }>;
  text_content?: string;
  colors?: {
    dominant_colors?: string[];
    color_scheme?: string;
  };
  emotional_tone?: string;
  key_elements?: string[];
  suggested_context?: string;
  marketing_insights?: string;
  quality_scores?: Record<string, number>;
  technical_details?: string;
}

export interface QuestionBankItem {
  question_id: string;
  question: string;
  scale: string;
  interpretation: string;
  metric_type: string;
  kpi_metric: string;
}

export interface S3Key {
  key: string;
  url: string;
  file_name: string;
  content_type: string;
}

export interface NewMediaSimulationResponse {
  simulation_analysis?: SimulationAnalysis;
  // Legacy support - direct fields (if API returns them directly)
  kpi_summary?: KPISummaryItem[];
  recommendation?: RecommendationData;
  visual_analysis?: VisualAnalysis[];
  question_bank?: QuestionBankItem[];
  s3_keys?: S3Key[];
}

// Filtered response structure - only includes required fields
export interface FilteredKPISummary {
  kpi_metric: string;
  average_response: number | null;
  min_response?: number | null;
  max_response?: number | null;
}

export interface FilteredRecommendation {
  modification_area?: string;
  current_state?: string;
  recommended_state?: string;
  specific_changes?: SpecificChanges;
  script_rewrite?: ScriptRewrite;
}

export interface FilteredMediaSimulationResponse {
  kpi_summary?: FilteredKPISummary[];
  recommendation?: {
    media_file_modifications?: FilteredRecommendation[];
    simulation_insights?: SimulationInsights;
  };
  visual_analysis?: VisualAnalysis[];
  question_bank?: QuestionBankItem[];
  s3_keys?: S3Key[];
}