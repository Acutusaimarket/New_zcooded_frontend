import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { productApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

interface ErrorResponse {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string): Promise<void> => {
      await axiosPrivateInstance.delete(
        `${productApiEndPoint.deleteProduct}/${productId}`
      );
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as ErrorResponse)?.response?.data?.detail ||
            "Failed to delete product"
          : "Failed to delete product";
      toast.error(errorMessage);
    },
  });
};
