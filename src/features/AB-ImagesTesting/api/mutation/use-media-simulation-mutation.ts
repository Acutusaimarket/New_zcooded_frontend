import { useMutation } from "@tanstack/react-query";

import { mediaSimulationApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { handleApiCall } from "@/lib/handle-api-call";
import type { APISuccessResponse } from "@/types/common.type";
import type {
  FilteredMediaSimulationResponse,
  MediaSimulationFormData,
  NewMediaSimulationResponse,
} from "@/types/media-simulation.type";

interface MediaSimulationMutationOptions {
  onSuccess?: (data: FilteredMediaSimulationResponse) => void;
  onError?: (error: Error) => void;
}

export const useMediaSimulationMutation = (
  options?: MediaSimulationMutationOptions
) => {
  return useMutation({
    mutationFn: handleApiCall<FilteredMediaSimulationResponse>(
      async (data: MediaSimulationFormData) => {
        const formData = new FormData();

      // Add persona ids
      data.persona_ids.forEach((id) => {
        formData.append("persona_ids", id);
      });

      // Add product id
      // formData.append("product_id", data.product_id);

      // Add questions if any
      if (data.questions && data.questions.length > 0) {
        data.questions.forEach((question) => {
          formData.append("questions", question);
        });
      }

      // Add environment_names if any
      if (data.environment_names && data.environment_names.length > 0) {
        data.environment_names.forEach((env) => {
          formData.append("environment_names", env);
        });
      }

      // Add simulation type
      formData.append("simulation_type", data.simulation_type);

      // Add model
      formData.append("model", data.model);

      // Add media files
      if (data.media_files && data.media_files.length > 0) {
        data.media_files.forEach((file, index) => {
          // Validate file before adding to form data
          if (!file || !(file instanceof File)) {
            throw new Error(
              `Invalid file at index ${index}: File object is required`
            );
          }

          // Debug logging for file information
          console.log(`File ${index + 1}:`, {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
          });

          // Ensure filename is preserved for backend recognition
          formData.append("media_files", file, file.name);
        });
      }

        const response = await axiosPrivateInstance.post<
          APISuccessResponse<NewMediaSimulationResponse>
        >(mediaSimulationApiEndPoint.runMediaSimulation, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const apiData = response.data?.data;
        if (!apiData) {
          throw new Error("No media simulation data returned from API");
        }

        const simulationAnalysis = apiData.simulation_analysis || apiData;
        const kpiSummary = simulationAnalysis.kpi_summary || apiData.kpi_summary;
        const recommendation =
          simulationAnalysis.recommendation || apiData.recommendation;
        const visualAnalysis =
          simulationAnalysis.visual_analysis || apiData.visual_analysis;
        const questionBank =
          simulationAnalysis.question_bank || apiData.question_bank;
        const s3Keys = simulationAnalysis.s3_keys || apiData.s3_keys;

        const filteredData: FilteredMediaSimulationResponse = {
          kpi_summary: kpiSummary?.map((item) => ({
            kpi_metric: item.kpi_metric,
                    average_response: item.average_response ?? null,
                    min_response: item.min_response ?? null,
                    max_response: item.max_response ?? null,
          })),
          recommendation: recommendation
            ? {
                media_file_modifications:
                  recommendation.media_file_modifications?.map((mod) => ({
                    modification_area: mod.modification_area,
                    current_state: mod.current_state,
                    recommended_state: mod.recommended_state,
                    specific_changes: mod.specific_changes,
                    script_rewrite: mod.specific_changes?.script_rewrite,
                  })),
                simulation_insights: recommendation.simulation_insights,
              }
            : undefined,
          visual_analysis: visualAnalysis,
          question_bank: questionBank,
          s3_keys: s3Keys,
        };

        const transformedResponse: APISuccessResponse<
          FilteredMediaSimulationResponse
        > = {
          success: response.data.success,
          message: response.data.message,
          data: filteredData,
        };

        return { data: transformedResponse };
      }
    ),
    onSuccess: options?.onSuccess,
    onError: (error) => {
      if (options?.onError && error instanceof Error) {
        options.onError(error);
      }
    },
  });
};
