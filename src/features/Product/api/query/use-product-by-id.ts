import { useQuery } from "@tanstack/react-query";

import { productApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { ProductDocument } from "../../types";

interface ProductResponse {
  data: ProductDocument;
  message: string;
  success: boolean;
}

export const useProductById = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<ProductResponse> => {
      const response = await axiosPrivateInstance.get(
        `${productApiEndPoint.getProductById}/${productId}`
      );
      return response.data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
