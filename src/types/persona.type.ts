export interface PersonaT {
  persona_category: string;
  name: string;
  description: string;
  demographic: {
    age_range: string;
    gender: string;
    occupation: string;
    income_tier: string;
    location: string;
    education: string;
  };
  behavior_patterns: {
    communication_style: string;
    response_tendency: string;
    decision_making_process: string;
    lifestyle: string;
    values: string[];
    purchasing_behavior: string;
    price_sensitivity: string;
    media_consumption: string;
  };
  traits: Array<{
    name: string;
    value: number;
    reason: string;
  }>;
  psychological_attributes: {
    personality_type: string;
    emotional_tendencies: string;
    cognitive_style: string;
    motivations: string[];
    fears: string[];
    stress_triggers: string[];
    coping_mechanisms: string[];
    learning_style: string;
  };
  status: "draft" | "published";
}

export interface PersonaData extends PersonaT {
  _id: string;
  metadata: string;
  user: string;
  created_at: string;
  updated_at: string;
}
