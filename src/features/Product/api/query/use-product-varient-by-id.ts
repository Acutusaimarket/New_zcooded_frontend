import { useQuery } from "@tanstack/react-query";

import { productApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { ProductDocument } from "../../types";

export const useProductVariantById = (productId: string) => {
  return useQuery({
    queryKey: ["product-variant", productId],
    queryFn: async (): Promise<ProductDocument[]> => {
      const response = await axiosPrivateInstance.get(
        // `${productApiEndPoint.getProducts}/${productId}/variants`
        `${productApiEndPoint.getProducts}${productId}/variants`
      );
      return response.data.data;
    },
    enabled: !!productId,
  });
};
