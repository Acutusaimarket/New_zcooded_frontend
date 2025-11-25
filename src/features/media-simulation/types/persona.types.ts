export interface PersonaDemographic {
  age_range: string;
  gender: string;
  occupation: string;
  income_tier: string;
  location: string;
  education: string;
}

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

export interface PersonaTrait {
  name: string;
  value: number; // 0-1
  reason: string;
}

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

export interface Persona {
  persona_category: string;
  name: string;
  description: string;
  demographic: PersonaDemographic;
  behavior_patterns: BehaviorPatterns;
  traits: PersonaTrait[];
  psychological_attributes: PsychologicalAttributes;
  status: string;
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  created_at: string;
  updated_at: string;
}
