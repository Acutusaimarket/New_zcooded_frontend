import type { AxiosError } from "axios";

import type {
  APIErrorResponse,
  APISuccessResponse,
  CommonPaginationResponse,
} from "@/types/common.type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiCall<TResponse, TArgs extends any[] = any[]> = (
  ...args: TArgs
) => Promise<{ data: TResponse }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiCall = <TResult, TArgs extends any[] = any[]>(
  apiCall: ApiCall<APISuccessResponse<TResult>, TArgs>
) => {
  return async (...args: TArgs): Promise<TResult> => {
    try {
      const response = await apiCall(...args);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<APIErrorResponse>;

      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;

        const validationErrors = errorData.validation_errors ?? [];
        if (validationErrors.length > 0) {
          const validationMessages = validationErrors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          throw new Error(`Validation failed: ${validationMessages}`);
        }

        throw new Error(errorData.message || "API request failed");
      }

      throw error as Error;
    }
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiCallPaginated = <TResult, TArgs extends any[] = any[]>(
  apiCall: ApiCall<CommonPaginationResponse<TResult>, TArgs>
) => {
  return async (...args: TArgs): Promise<CommonPaginationResponse<TResult>> => {
    try {
      const response = await apiCall(...args);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<APIErrorResponse>;

      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;

        const validationErrors = errorData.validation_errors ?? [];
        if (validationErrors.length > 0) {
          const validationMessages = validationErrors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          throw new Error(`Validation failed: ${validationMessages}`);
        }

        throw new Error(errorData.message || "API request failed");
      }

      throw error as Error;
    }
  };
};
