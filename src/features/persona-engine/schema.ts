import z from "zod";

export const personaEngineSchema = z.object({
  num_personas: z.coerce.number().int().min(1).max(10).default(1),
  model: z.enum(["gpt-4o", "gpt-4o-mini", "gpt-5"]).default("gpt-4o"),
  meta_data_id: z.string().min(1, "Meta data ID is required"),
});

export const personaLLMSchema = z.object({
  // Product Information
  product_name: z.string().optional(),
  product_description: z.string().optional(),
  industry: z.string().optional(),
  business_goal: z.string().optional(),

  // Demographics
  age_group: z.string().array().min(1, "Age group is required"),
  gender: z.string().min(1, "Gender is required").array(),
  state_city: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  education_level: z.string().min(1, "Education level is required").array(),
  occupation: z.string().min(1, "Occupation is required").array(),
  budget: z.string().min(1, "Budget range is required").array(),

  // Core Drivers - Goals & Motivations
  goals_motivations: z
    .array(z.string())
    .min(1, "At least one goal is required"),
  custom_goal: z.string().optional(),

  // Pain Points & Challenges
  pain_points: z
    .array(z.string())
    .min(1, "At least one pain point is required"),
  custom_pain_point: z.string().optional(),

  // Decision Triggers
  decision_triggers: z
    .array(z.string())
    .min(1, "At least one decision trigger is required"),
  custom_trigger: z.string().optional(),

  // Preferred Channels
  preferred_channels: z
    .array(z.string())
    .min(1, "At least one channel is required"),
  custom_channel: z.string().optional(),

  // Psychographics (Optional)
  personality_traits: z.array(z.string()).optional(),
  custom_personality: z.string().optional(),
  values: z.array(z.string()).optional(),
  emotional_drivers: z.array(z.string()).optional(),

  // Contextual Behavior (Optional)
  weekday_habits: z.string().optional(),
  weekend_habits: z.string().optional(),
  online_offline_patterns: z.array(z.string()).optional(),
  device_usage: z.array(z.string()).optional(),

  // Journey Mapping (Optional)
  awareness_channels: z.array(z.string()).optional(),
  consideration_factors: z.array(z.string()).optional(),
  decision_factors: z.array(z.string()).optional(),
  loyalty_factors: z.array(z.string()).optional(),

  // Tech/Media Usage (Optional)
  preferred_apps: z.array(z.string()).optional(),
  social_platforms: z.array(z.string()).optional(),
  content_formats: z.array(z.string()).optional(),

  // Brand Affinities (Optional)
  brand_affinities: z.string().optional(),

  // Quotes (Optional)
  persona_quotes: z.string().optional(),

  // Legacy fields for backward compatibility
  city_tier: z.string().optional(),
  customer_description: z.string().optional(),
  additional_requirements: z.string().optional(),

  // AI Configuration
  model: z.enum(["gpt-4o", "gpt-4o-mini", "gpt-5"]).default("gpt-4o"),
  no_of_personas: z.coerce.number().int().min(1).max(10).default(1),
});

export type PersonaLLMSchema = z.infer<typeof personaLLMSchema>;

export type PersonaEngineSchema = z.infer<typeof personaEngineSchema>;
