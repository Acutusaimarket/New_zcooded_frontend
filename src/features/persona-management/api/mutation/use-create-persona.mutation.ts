import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import type { CreatePersonaResponse } from "@/features/persona-studio";
import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { PersonaT } from "@/types/persona.type";

export const useCreatePersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PersonaT) => {
      try {
        const response = await axiosPrivateInstance.post<CreatePersonaResponse>(
          personasApiEndPoint.CreatePersonas,
          data
        );

        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.status === 422) {
            throw new Error(
              error.response?.data.validation_errors
                .map((e: { message: string }) => e.message)
                .join(", ") || "Validation error occurred"
            );
          } else {
            throw new Error(
              error.response?.data?.detail || "Failed to create persona"
            );
          }
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch personas list after successful creation
      queryClient.invalidateQueries({
        queryKey: ["personas-list"],
      });
      // Also invalidate stats queries
      queryClient.invalidateQueries({
        queryKey: ["personas", "stats"],
      });
    },
  });
};
