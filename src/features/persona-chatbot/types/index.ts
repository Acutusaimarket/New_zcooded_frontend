import type { PersonaData } from "@/types/persona.type";

export type GeneratedQuestion = {
  question_text: string;
  answer_option?: string[] | null;
  has_answered: boolean;
  answer?: string | null;
};

export type ChatMessageMinimal = {
  _id: string;
  message_content: string;
  answer?: string | null;
  thinking_text?: string;
  created_at: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta_data?: Record<string, any> | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ChatMessageType<T extends any[]> = {
  generated_personas?: T;
} & ChatMessageMinimal;

export type PersonaChatSession = {
  _id: string;
  name: string;
  generated_questions?: GeneratedQuestion[] | null;
  mode?:
    | "initial_prompt"
    | "question_generated"
    | "generated_persona"
    | "summary_generated";
  messages?: ChatMessageType<PersonaData[]>[] | null;
  generated_personas?: unknown[] | null;
  created_at: string;
  updated_at: string;
};

export type ChatSessionHistoryItem = {
  _id: string;
  name: string;
  mode: string;
  persona_summary: string;
  created_at: string;
  updated_at: string;
};
