import { mediaSimulationApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

import type {
  MediaHistoryParams,
  MediaHistoryResponse,
} from "../types/media-history.types";

// API function to fetch media history with pagination and sorting
const fetchMediaHistoryApi = async (
  params: MediaHistoryParams
): Promise<MediaHistoryResponse> => {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    page_size: params.page_size.toString(),
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });

  const response = await axiosPrivateInstance.get<MediaHistoryResponse>(
    `${mediaSimulationApiEndPoint.getMediaHistory}?${queryParams.toString()}`
  );

  return response.data;
};

// Export API call with error handling
export const fetchMediaHistory = async (
  params: MediaHistoryParams
): Promise<MediaHistoryResponse> => {
  try {
    return await fetchMediaHistoryApi(params);
  } catch (error) {
    console.error("Failed to fetch media history:", error);
    throw error;
  }
};

// For React Query keys
export const mediaHistoryKeys = {
  all: ["media-history"] as const,
  lists: () => [...mediaHistoryKeys.all, "list"] as const,
  list: (params: MediaHistoryParams) =>
    [...mediaHistoryKeys.lists(), params] as const,
};
