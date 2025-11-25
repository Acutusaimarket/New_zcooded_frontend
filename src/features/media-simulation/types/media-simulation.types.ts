/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Persona } from "./persona.types";
import type { Product } from "./product.types";

export interface KPIMetrics {
  engagement_potential: number; // 0-100
  message_clarity: number; // 0-100
  emotional_impact: number; // 0-100
  brand_consistency: number; // 0-100
  conversion_potential: number; // 0-100
  production_quality: number; // 0-100
  relevance_score: number; // 0-100
  overall_effectiveness: number; // 0-100
  rationales: {
    engagement_potential: string;
    message_clarity: string;
    emotional_impact: string;
    brand_consistency: string;
    conversion_potential: string;
    production_quality: string;
    relevance_score: string;
    overall_effectiveness: string;
  };
  users_who_recall_ad: number;
  users_who_recall_message: number;
  user_associating_ad_with_brand: number;
  change_in_emotional_valence_before: number;
  change_in_emotional_valence_after: number;
  user_rating_brand_positively_post_exposure: number;
  users_considering_buying: number;
  pre_exposure_nps: number;
  post_exposure_nps: number;
  users_agreeing_brand_trust: number;
  users_who_creative_appeal: number;
  users_understood_message: number;
  users_saying_ad_was_distinctive: number;
  users_share_intent: number;
  total_users_simulated: number;

  ad_recall_rate: number; // percentage
  message_recall_rate: number; // percentage
  brand_linkage_rate: number; // percentage
  affective_uplift: number; // float
  brand_favorability_rate: number; // percentage
  brand_consideration_uplift: number; // percentage
  brand_trust_index: number; // percentage
  creative_appeal_rate: number; // percentage
  clarity_of_message_rate: number; // percentage
  distinctiveness_score_rate: number; // percentage
  simulated_share_intent_rate: number; // percentage
}

export interface BehavioralMetrics {
  /**
   * Defines the maximum number of times an ad should be shown to the same user within a specific timeframe.
   * Used to prevent overexposure and ad fatigue.
   * @minimum 1
   */
  frequency_cap: number;

  /**
   * Specifies the number of days to wait before re-engaging the same audience with similar content.
   * Helps maintain audience freshness and avoid repetition fatigue.
   * @minimum 0
   */
  cooldown_days: number;

  /**
   * Indicates the maximum number of distinct user interactions or exposures allowed per campaign.
   * Helps optimize campaign frequency and user journey management.
   * @minimum 1
   */
  max_touchpoints: number;

  /**
   * Represents how quickly the memory or recall of the content decays over time, expressed in days.
   * A longer half-life suggests better memorability.
   * @minimum 1
   */
  memory_half_life_days: number;

  /**
   * Quantifies the rate at which audience responsiveness decreases with repeated exposures.
   * A higher rate indicates that viewers get tired of the ad more quickly.
   * @minimum 0
   * @maximum 1
   */
  fatigue_rate: number;

  /**
   * Probability that a user will be exposed to the ad, considering targeting accuracy and platform reach.
   * @minimum 0
   * @maximum 1
   */
  exposure_prob: number;

  /**
   * Likelihood that an exposed user will click on the ad.
   * Reflects both content appeal and relevance to the audience.
   * @minimum 0
   * @maximum 1
   */
  click_prob: number;

  /**
   * Estimated probability that a click will result in a desired conversion (e.g., signup, purchase).
   * Derived from engagement and conversion funnel analysis.
   * @minimum 0
   * @maximum 1
   */
  conversion_prob: number;

  /**
   * Average number of seconds users are expected to focus on the ad before disengaging.
   * Higher values indicate stronger attention retention.
   * @minimum 0
   */
  attention_seconds: number;

  /**
   * Overall sentiment detected in the media content based on tone, language, and visual cues.
   * Used to gauge audience emotional response.
   */
  sentiment_label: "Positive" | "Neutral" | "Negative";

  /**
   * Represents how well the target audience aligns with the content's intended demographic or psychographic profile.
   * Higher values mean stronger persona targeting accuracy.
   * @minimum 0
   * @maximum 1
   */
  audience_weight: number;

  /**
   * Reflects how effectively the content resonates with the defined persona.
   * A high score suggests strong emotional and contextual alignment with the target audience's motivations and identity.
   * @minimum 0
   * @maximum 100
   */
  persona_resonance: number;
}

export interface AnalysisInsights {
  key_strengths: string[];
  key_concerns: string[];
  positive_aspects: string[];
  negative_aspects: string[];
  recommendations: string[];
}

export interface MediaMetadata {
  file_size: number;
  file_name: string;
  content_type: string;
}

export interface MediaFile {
  media_id: string;
  media_type: string;
  media_url: string;
  s3_key: string;
  media_size: number;
}

interface ObservedElements {
  /**
   * Overall description of what was observed in the media content.
   */
  description: string;

  /**
   * List of key visual elements observed (colors, objects, people, scenes, composition).
   */
  key_visuals: string[];

  /**
   * Any text, headlines, captions, or copy visible in the media.
   * @default []
   */
  text_content: string[];

  /**
   * Specific notable moments with timestamps (for video) or focal points (for images).
   * @default []
   */
  notable_moments: string[];
}

export interface MediaAnalysis {
  kpi_metrics: KPIMetrics;
  // insights: AnalysisInsights;
  behavioral_metrics: BehavioralMetrics;
  // executive_summary: string;
  // target_audience_fit: string;
  // campaign_suitability: string[];
  // risk_assessment: string;
  // product_alignment: number; // 0-100
  // persona_resonance: number; // 0-100
  observed_elements: ObservedElements;
  analysis_id: string;
  persona_id: string;
  media_id: string;
  // product_id: string;
  timestamp: string;
  media_type: "image" | "video" | "audio";
  metadata: MediaMetadata;
  custom_questions_responses?: Record<string, string>;
}

export interface KPIComparisonMatrix {
  analysis_id: string;
  kpi_scores: Omit<KPIMetrics, "relevance_score">;
}

export interface RankingItem {
  rank: number;
  analysis_id: string;
  justification: string;
}

export interface StrengthsWeaknesses {
  analysis_id: string;
  strengths: string[];
  weaknesses: string[];
}

export interface PersonaRecommendation {
  persona_id: string;
  media_id: string;
  reason: string;
}

export interface RiskFactor {
  analysis_id: string;
  risks: string[];
  risk_level: "Low" | "Medium" | "High";
}

export interface FinalRecommendation {
  analysis_id: string;
  rationale: string;
  expected_outcomes: string[];
}

export interface ComparisonAnalysis {
  kpi_comparison_matrix: KPIComparisonMatrix[];
  ranking: RankingItem[];
  strengths_weaknesses: StrengthsWeaknesses[];
  persona_recommendations: PersonaRecommendation[];
  product_alignment: string;
  final_recommendation: FinalRecommendation;
  risk_factors: RiskFactor[];
  confidence_score: number;
  media_recommendations: {
    media_id: string;
    rationale: string;
  }[];
}

export interface PrimaryRecommendation {
  media_id: string;
  analysis_id: string;
  overall_score: number;
  persona_match: string;
  selection_rationale: string[];
  confidence_score: number;
}

export interface PersonaSpecificInsight {
  persona_id: string;
  best_performing_media: string;
  key_messaging_opportunities: string[];
  content_gaps: string[];
  recommended_improvements: string[];
}

export interface PerformanceMatrix {
  high_performers: string[];
  moderate_performers: string[];
  underperformers: string[];
}

export interface StrategicRecommendations {
  campaign_focus: string;
  content_optimization: string[];
  risk_mitigation: string[];
  messaging_themes: string[];
  target_audience_priorities: string[];
}

export interface ExecutionPriorities {
  immediate_use: string[];
  needs_modification: string[];
  avoid_usage: string[];
  ab_testing_opportunities: string[];
  production_priorities: string[];
}

export interface QualityMetrics {
  average_effectiveness_score: number;
  recommendation_confidence: number;
  coverage_score: number;
  alignment_score: number;
}

export interface AdditionalInsights {
  surprising_findings: string[];
  market_opportunities: string[];
  competitive_advantages: string[];
  scalability_factors: string[];
}

export interface MediaRecommendations {
  primary_recommendations: PrimaryRecommendation[] | null;
  persona_specific_insights: PersonaSpecificInsight[] | null;
  performance_matrix: PerformanceMatrix | null;
  strategic_recommendations: StrategicRecommendations | null;
  execution_priorities: ExecutionPriorities | null;
  quality_metrics: QualityMetrics | null;
  additional_insights: AdditionalInsights | null;
  total_media_analyzed: number;
  recommendation_version: string;
}

export interface MediaSimulationData {
  _id: string;
  model_used: string;
  media_files: MediaFile[];
  individual_analysis: MediaAnalysis[];
  comparison_analysis: ComparisonAnalysis;
  media_recommendations: MediaRecommendations;
  // comparison_analysis: null;
  // media_recommendations: null;
  created_at: string;
  updated_at: string;
  participated_personas: Array<Omit<Persona, "metadata" | "user">>;
  participated_product: Product;
  // participated_product: null;
  context_layer?: Record<string, Array<Record<string, any>>>;
  custom_questions?: string[];
  custom_questions_responses?: Record<string, string>;
}

// export interface MediaSimulationResponse {
//   status: number;
//   success: boolean;
//   message: string;
//   data: MediaSimulationData;
// }

// Re-export types from other modules for convenience
export type { Persona } from "./persona.types";
export type { Product } from "./product.types";
