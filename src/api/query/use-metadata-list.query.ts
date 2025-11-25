import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse, isAxiosError } from "axios";

import { metadataApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import type { MetadataListResponse } from "@/types/metadata.type";

export interface MetadataListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const useMetadataListQuery = (params: MetadataListParams = {}) => {
  const { page = 1, per_page = 50, search } = params;

  return useQuery({
    queryKey: ["metadata-list", params],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams();

        queryParams.append("page", page.toString());
        queryParams.append("per_page", per_page.toString());

        if (search) queryParams.append("search", search);

        const response: AxiosResponse<MetadataListResponse> =
          await axiosPrivateInstance.get(
            `${metadataApiEndPoint.getMetadataList}?${queryParams.toString()}`
          );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.detail || "Failed to fetch metadata list"
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
  });
};
