import { useQuery } from "@tanstack/react-query";

import { personasApiEndPoint } from "../../../../lib/api-end-point";
import { axiosPrivateInstance } from "../../../../lib/axios";
import type { PersonaLibFilters, PersonaLibResponse } from "../../types";

const getPersonaLib = async (
  filters: PersonaLibFilters
): Promise<PersonaLibResponse> => {
  const params = new URLSearchParams();

  // Add all filter parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await axiosPrivateInstance.get(
    `${personasApiEndPoint.getPersonaLib}?${params.toString()}`
  );
  return response.data;
};

export const useGetPersonaLib = (filters: PersonaLibFilters) => {
  return useQuery({
    queryKey: ["persona-lib", filters],
    queryFn: () => getPersonaLib(filters),
  });
};
