import { useQuery } from "@tanstack/react-query";

import { productApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { ProductListResponse } from "../../types";

// Remove ProductDocument from here

export const useProductVariants = (productId: string) => {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async (): Promise<ProductListResponse> => {
      const response = await axiosPrivateInstance.get(
        `${productApiEndPoint.getProducts}?parent_id=${productId}&product_type=variant`
      );
      return response.data.data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
