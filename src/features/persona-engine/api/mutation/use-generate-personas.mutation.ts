import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { GeneratePersonasResponse } from "../../types";

interface UseGeneratePersonasMutationProps {
  onSuccess?: (data: GeneratePersonasResponse) => void;
  onError?: (error: Error) => void;
}

interface GeneratePersonasParams {
  num_personas: number;
  model?: "gpt-4o" | "gpt-4o-mini" | "gpt-5";
  meta_data_id: string;
  onSuccess?: (data: GeneratePersonasResponse) => void;
}

export const useGeneratePersonasMutation = ({
  onSuccess,
  onError,
}: UseGeneratePersonasMutationProps) => {
  const queryClient = useQueryClient();
  // const ref = useRef<number | string | undefined>(undefined);
  return useMutation({
    mutationFn: async ({
      num_personas,
      meta_data_id,
      model = "gpt-4o",
    }: GeneratePersonasParams) => {
      toast.loading("Generating personas...", {
        id: "generating-personas",
      });
      const response =
        await axiosPrivateInstance.post<GeneratePersonasResponse>(
          personasApiEndPoint.GeneratePersonas,
          {
            // Backend expects num_clusters to mirror the UI "Number of Persona"
            num_clusters: num_personas,
            model,
            meta_data_id,
          }
        );

      // setGeneratedPersonas(response.data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Personas generated successfully!", {
        id: "generating-personas",
      });
      toast.dismiss("generating-personas");
      queryClient.invalidateQueries({ queryKey: ["personas-list"] });
      queryClient.invalidateQueries({ queryKey: ["personas", "stats"] });
      onSuccess?.(data);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 422) {
          // Handle validation errors
          const validationErrors = error.response?.data?.validation_errors;
          if (
            validationErrors &&
            Array.isArray(validationErrors) &&
            validationErrors.length > 0
          ) {
            const firstError = validationErrors[0];
            const errorMessage =
              firstError.message || "Request validation failed";
            toast.error(errorMessage, {
              id: "generating-personas",
            });
            // Return the error with validation details for form handling
            onError?.(error);
            return;
          }
          toast.error(
            error.response?.data?.message || "Request validation failed",
            {
              id: "generating-personas",
            }
          );
          onError?.(error);
          return;
        }
        if (error.response?.status === 400) {
          // Handle missing active subscription plan
          const message =
            error.response?.data?.message ||
            "User does not have an active subscription plan.";
          toast.error(message, {
            id: "generating-personas",
          });
          onError?.(error);
          return;
        }
        if (error.response?.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.", {
            id: "generating-personas",
          });
          return;
        }
        if (error.response?.status === 401) {
          toast.error("Unauthorized access. Please log in again.", {
            id: "generating-personas",
          });
          return;
        }
      }
      toast.error(
        error?.message || "An error occurred while generating personas.",
        {
          id: "generating-personas",
        }
      );
      // Handle error, e.g., show an error message
      onError?.(error);
    },
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 422) {
        // If the error is a validation error, do not retry
        return false;
      }
      if (isAxiosError(error) && error.response?.status === 400) {
        // If the error is a subscription error, do not retry
        return false;
      }
      if (isAxiosError(error) && error.response?.status === 429) {
        // If the error is a rate limit error, do not retry
        return false;
      }
      if (isAxiosError(error) && error.response?.status === 401) {
        // If the error is an unauthorized error, do not retry
        return false;
      }
      if (failureCount >= 3) {
        // If the failure count exceeds 3, do not retry
        return false;
      }
      toast.loading(`Retrying to generate personas... (${failureCount + 1})`, {
        id: "generating-personas",
      });
      return true;
    },
    retryDelay: 0,
  });
};

export type UseGeneratePersonasMutationResult = ReturnType<
  typeof useGeneratePersonasMutation
>["data"];
