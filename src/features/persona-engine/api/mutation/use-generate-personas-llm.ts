import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { PersonaLLMSchema } from "../../schema";
import type { GeneratePersonasLLMResponse } from "../../types";

export const useGeneratePersonasLLMMutation = () => {
  return useMutation({
    mutationFn: async (data: PersonaLLMSchema) => {
      try {
        toast.loading("Generating personas...", {
          position: "top-right",
          id: "generating-personas-llm",
        });
        const response =
          await axiosPrivateInstance.post<GeneratePersonasLLMResponse>(
            personasApiEndPoint.generatePersonasLLM,
            data
          );
        toast.success("Personas generated successfully!", {
          id: "generating-personas-llm",
          position: "top-right",
        });
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ||
              error.response?.data?.detail ||
              "Failed to generate personas",
            {
              id: "generating-personas-llm",
            }
          );
          throw new Error(
            error.response?.data?.message ||
              error.response?.data?.detail ||
              "Failed to generate personas"
          );
        }
      }
    },
  });
};
