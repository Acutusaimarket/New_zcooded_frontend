import { useMutation, useQueryClient } from "@tanstack/react-query";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { PersonaData } from "@/types/persona.type";

export const useDeleteMultiplePersonasMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (personaIds: string[]) => {
      const response = await axiosPrivateInstance.delete<{
        message: string;
        success: boolean;
        updated_personas: Array<PersonaData>;
      }>(personasApiEndPoint.deleteMultiplePersonas, {
        data: { persona_ids: personaIds },
      });

      return response.data.updated_personas;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["personas"],
      });
      return data;
    },
    onError: (error) => {
      console.error("Error deleting personas:", error);
      throw error;
    },
  });
};
