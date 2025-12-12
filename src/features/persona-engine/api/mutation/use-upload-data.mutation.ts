import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosResponse, isAxiosError } from "axios";

import { metadataApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { UploadAnalysisData } from "@/types/metadata.type";

import { usePersonaEngineStore } from "../../hooks/persona-engine.hooks";

export const usePersonaEngineUploadDataMutation = () => {
  const queryClient = useQueryClient();
  const setUploadFileResponse = usePersonaEngineStore(
    (state) => state.setUploadFileResponse
  );

  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response: AxiosResponse<UploadAnalysisData> =
          await axiosPrivateInstance.post(
            metadataApiEndPoint.uploadMetadata,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  onProgress(percentCompleted);
                }
              },
            }
          );
        setUploadFileResponse(response.data);
        queryClient.invalidateQueries({ queryKey: ["metadata-list"] });
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.detail || "Upload failed");
        }
      }
    },
  });
};
