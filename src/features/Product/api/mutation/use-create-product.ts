import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { productApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { CreateProductRequest, ProductDocument } from "../../types";

interface CreateProductResponse {
  data: ProductDocument;
  message: string;
  success: boolean;
}

interface ErrorResponse {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      productData: CreateProductRequest
    ): Promise<CreateProductResponse> => {
      const response = await axiosPrivateInstance.post(
        productApiEndPoint.createProduct,
        productData
      );
      return response.data;
    },
    onSuccess: (_data) => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as ErrorResponse)?.response?.data?.detail ||
            "Failed to create product"
          : "Failed to create product";
      toast.error(errorMessage);
    },
  });
};
