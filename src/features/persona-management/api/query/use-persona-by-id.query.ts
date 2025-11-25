import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse, isAxiosError } from "axios";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { PersonaData } from "@/types/persona.type";

export const usePersonaByIdQuery = (personaId: string | null) => {
  return useQuery({
    queryKey: ["personas", "detail", personaId],
    queryFn: async () => {
      if (!personaId) {
        throw new Error("Persona ID is required");
      }

      try {
        const response: AxiosResponse<PersonaData> =
          await axiosPrivateInstance.get(
            `${personasApiEndPoint.getPersonaById}/${personaId}`
          );

        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.detail || "Failed to fetch persona"
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    enabled: !!personaId,
  });
};
