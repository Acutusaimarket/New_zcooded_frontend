import { useMutation } from "@tanstack/react-query";
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
            num_personas,
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
      onSuccess?.(data);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
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
