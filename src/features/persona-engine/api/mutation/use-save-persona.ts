import { useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { PersonaData } from "@/types/persona.type";

export const useSavePersonaMutation = () => {
  const toastRef = useRef<number | string | undefined>(undefined);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (personaData: {
      personaIds: string[];
      status: "published" | "draft";
    }) => {
      try {
        toastRef.current = toast.loading("Saving personas...", {
          position: "top-right",
        });
        const response = await axiosPrivateInstance.patch<{
          message: string;
          success: boolean;
          updated_personas: Array<PersonaData>;
        }>(personasApiEndPoint.BulkUpdateStatusPersonas, {
          persona_ids: personaData.personaIds,
          status: personaData.status,
        });

        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.detail || "Failed to generate personas"
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personas-list"] });
      queryClient.invalidateQueries({ queryKey: ["personas", "stats"] });
      toast.success("Personas saved successfully!", {
        id: toastRef.current,
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: toastRef.current,
        position: "top-right",
      });
    },
  });
};
