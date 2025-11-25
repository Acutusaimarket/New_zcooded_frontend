import { useQuery } from "@tanstack/react-query";

import { productApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { ProductFilters, ProductListResponse } from "../../types";

export const useProductsList = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async (): Promise<ProductListResponse> => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await axiosPrivateInstance.get(
        `${productApiEndPoint.getProducts}?${params.toString()}`
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
