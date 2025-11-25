import { useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

interface DeletePersonaParams {
  persona_id: string;
}

interface DeletePersonaResponse {
  success: boolean;
  message: string;
}

export const useDeletePersonaMutation = () => {
  const queryClient = useQueryClient();
  const postRef = useRef<number | string | undefined>(undefined);

  return useMutation({
    mutationFn: async ({ persona_id }: DeletePersonaParams) => {
      try {
        postRef.current = toast.loading("Deleting persona...", {
          position: "top-right",
          dismissible: false,
        });
        const response =
          await axiosPrivateInstance.delete<DeletePersonaResponse>(
            `${personasApiEndPoint.deletePersona}/${persona_id}`
          );

        // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.detail || "Failed to delete persona"
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch personas list after successful creation
      queryClient.invalidateQueries({
        queryKey: ["personas-list"],
      });
      toast.success("Persona deleted successfully", {
        id: postRef.current,
        position: "top-right",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: postRef.current,
        position: "top-right",
      });
    },
  });
};
