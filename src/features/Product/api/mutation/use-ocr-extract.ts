import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { productApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { OCRExtractResponse, OCRUploadRequest } from "../../types/ocr";

interface ErrorResponse {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export const useOCRExtract = () => {
  return useMutation({
    mutationFn: async (
      request: OCRUploadRequest
    ): Promise<OCRExtractResponse> => {
      const formData = new FormData();

      // Append all images
      request.images.forEach((image) => {
        formData.append("files", image);
      });

      const response = await axiosPrivateInstance.post(
        productApiEndPoint.uploadProductImage,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          data.message || "Product information extracted successfully!"
        );
      } else {
        toast.error("Failed to extract product information");
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as ErrorResponse)?.response?.data?.detail ||
            "Failed to extract product information"
          : "Failed to extract product information";
      toast.error(errorMessage);
    },
  });
};
