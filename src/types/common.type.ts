export interface CommonPaginationResponse<T> {
  success: boolean;
  items: T;
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  total_count: number;
}

export interface APISuccessResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface APIValidationError {
  field: string;
  input_value: string;
  message: string;
  type: string;
}

export interface APIErrorResponse {
  status: number;
  success: boolean;
  message: string;
  validation_errors?: APIValidationError[];
}
