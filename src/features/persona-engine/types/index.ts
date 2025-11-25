import type { ApiResponse } from "@/features/Product/types";
import type { PersonaData } from "@/types/persona.type";

// export type GeneratePersonasResponse = {
//   message: string;
//   success: boolean;
//   personas: PersonaData[];
//   output_file: string;
//   count: number;
// };
export type GeneratePersonasResponse = ApiResponse<PersonaData[]>;

export type GeneratePersonasLLMResponse = ApiResponse<PersonaData[]>;
