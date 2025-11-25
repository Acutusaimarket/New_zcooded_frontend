import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse, isAxiosError } from "axios";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type { PersonasListParams, PersonasListResponse } from "../../types";

export const usePersonasListQuery = (params: PersonasListParams = {}) => {
  const {
    page = 1,
    per_page = 14,
    search,
    sort_by,
    sort_order,
    status,
    location,
    age_min,
    age_max,
    gender,
    metadata_id,
  } = params;

  return useQuery({
    queryKey: ["personas-list", params],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams();

        queryParams.append("page", page.toString());
        queryParams.append("per_page", per_page.toString());

        if (search) queryParams.append("search", search);
        if (sort_by) queryParams.append("sort_by", sort_by);
        if (sort_order) queryParams.append("sort_order", sort_order);
        if (status) queryParams.append("status", status);
        if (location) queryParams.append("location", location);
        if (age_min) queryParams.append("age_min", age_min.toString());
        if (age_max) queryParams.append("age_max", age_max.toString());
        if (gender) queryParams.append("gender", gender);
        if (metadata_id) queryParams.append("metadata_id", metadata_id);

        const response: AxiosResponse<PersonasListResponse> =
          await axiosPrivateInstance.get(
            `${personasApiEndPoint.getPersonasList}?${queryParams.toString()}`
          );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.detail || "Failed to fetch personas list"
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
