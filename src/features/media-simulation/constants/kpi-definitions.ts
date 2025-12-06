export const KPI_DEFINITIONS = {
  engagement_potential: {
    label: "Engagement Potential",
    description: "Likelihood to capture and hold audience attention",
    maxScore: 10,
  },
  message_clarity: {
    label: "Message Clarity",
    description: "How clear and understandable the communication is",
    maxScore: 10,
  },
  emotional_impact: {
    label: "Emotional Impact",
    description: "Ability to evoke emotional response from viewers",
    maxScore: 10,
  },
  brand_consistency: {
    label: "Brand Consistency",
    description: "Alignment with brand identity and guidelines",
    maxScore: 10,
  },
  conversion_potential: {
    label: "Conversion Potential",
    description: "Likelihood to drive desired actions or purchases",
    maxScore: 10,
  },
  production_quality: {
    label: "Production Quality",
    description: "Technical and creative execution quality",
    maxScore: 10,
  },
  relevance_score: {
    label: "Relevance Score",
    description: "Relevance to target audience and context",
    maxScore: 10,
  },
  overall_effectiveness: {
    label: "Overall Effectiveness",
    description: "Combined effectiveness across all metrics",
    maxScore: 100,
  },
  roas: {
    label: "ROAS",
    description: "Return on Ad Spend - Revenue generated per dollar spent on advertising",
    maxScore: 10,
  },
} as const;

export const PERSONA_TRAIT_DEFINITIONS = {
  health_consciousness: {
    label: "Health Consciousness",
    description: "Level of awareness and concern about health",
  },
  treatment_adherence: {
    label: "Treatment Adherence",
    description: "Tendency to follow medical instructions",
  },
  medical_skepticism: {
    label: "Medical Skepticism",
    description: "Level of doubt about medical recommendations",
  },
  pain_tolerance: {
    label: "Pain Tolerance",
    description: "Ability to endure physical discomfort",
  },
  wellness_investment: {
    label: "Wellness Investment",
    description: "Willingness to invest time/money in health",
  },
} as const;
