import { z } from "zod";

const demographicSchema = z.object({
  age_range: z.string().min(1, "Age range is required"),
  gender: z.string().min(1, "Gender is required"),
  occupation: z.string().min(1, "Occupation is required"),
  income_tier: z.string().min(1, "Income tier is required"),
  location: z.string().min(1, "Location is required"),
  education: z.string().min(1, "Education is required"),
});

const behaviorPatternsSchema = z.object({
  communication_style: z.string().min(1, "Communication style is required"),
  response_tendency: z.string().min(1, "Response tendency is required"),
  decision_making_process: z
    .string()
    .min(1, "Decision making process is required"),
  lifestyle: z.string().min(1, "Lifestyle is required"),
  values: z.array(z.string().min(1, "Value is required")),
  purchasing_behavior: z.string().min(1, "Purchasing behavior is required"),
  price_sensitivity: z.string().min(1, "Price sensitivity is required"),
  media_consumption: z.string().min(1, "Media consumption is required"),
});

const psychologicalAttributesSchema = z.object({
  personality_type: z.string().min(1, "Personality type is required"),
  emotional_tendencies: z.string().min(1, "Emotional tendencies is required"),
  cognitive_style: z.string().min(1, "Cognitive style is required"),
  motivations: z.array(z.string().min(1, "Motivation is required")),
  fears: z.array(z.string().min(1, "Fear is required")),
  stress_triggers: z.array(z.string().min(1, "Stress trigger is required")),
  coping_mechanisms: z.array(z.string().min(1, "Coping mechanism is required")),
  learning_style: z.string().min(1, "Learning style is required"),
});

// Modified schema to work with useFieldArray
const personaFormSchema = z.object({
  persona_category: z.string().min(1, "Persona category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.literal("draft").or(z.literal("published")),
  demographic: demographicSchema,
  behavior_patterns: behaviorPatternsSchema,
  traits: z
    .array(
      z.object({
        name: z.string().min(1, "Trait name is required"),
        value: z.number().min(0, "Value must be at least 0"),
        reason: z.string().min(1, "Reason is required"),
      })
    )
    .min(1, "At least one trait is required"),
  psychological_attributes: psychologicalAttributesSchema,
});

type PersonaFormData = z.infer<typeof personaFormSchema>;

export { personaFormSchema, type PersonaFormData };
