import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { PersonaData, PersonaT } from "@/types/persona.type";

interface UpdatePersonaParams {
  persona_id: string;
  data: Partial<PersonaT>;
}

export const useUpdatePersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ persona_id, data }: UpdatePersonaParams) => {
      try {
        const response = await axiosPrivateInstance.put<PersonaData>(
          `${personasApiEndPoint.updatePersonas}/${persona_id}`,
          {
            update_data: data,
          }
        );

        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.detail || "Failed to update persona"
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["personas", "stats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["personas-list"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        description: "Failed to update persona. Please try again.",
      });
    },
  });
};
