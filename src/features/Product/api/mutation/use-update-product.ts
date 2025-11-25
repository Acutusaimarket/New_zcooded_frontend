import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { productApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { ProductDocument, UpdateProductRequest } from "../../types";

interface UpdateProductResponse {
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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      productData,
    }: {
      productId: string;
      productData: UpdateProductRequest;
    }): Promise<UpdateProductResponse> => {
      const response = await axiosPrivateInstance.put(
        `${productApiEndPoint.updateProduct}/${productId}`,
        productData
      );
      return response.data;
    },
    onSuccess: (_data) => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as ErrorResponse)?.response?.data?.detail ||
            "Failed to update product"
          : "Failed to update product";
      toast.error(errorMessage);
    },
  });
};
