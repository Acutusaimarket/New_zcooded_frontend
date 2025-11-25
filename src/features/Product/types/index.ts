export interface ProductDocument {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  features?: string[];
  specification?: Record<string, string>;
  color?: string;
  size?: string;
  weight?: string;
  metadata?: Record<string, string>; // Changed from any
  user: string;
  parent?: string;
  product_type: "variant" | "product";
  created_at: string;
  updated_at: string;
  is_active?: boolean;
  country?: string;
  city?: string;
}

export interface CreateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  features?: string[];
  specification?: Record<string, string>;
  color?: string;
  size?: string;
  weight?: string;
  metadata?: Record<string, string>; // Changed from any
  product_type: "variant" | "product";
  parent_id?: string;
  country?: string;
  city?: string;
  s3_key?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  features?: string[];
  specification?: Record<string, string>;
  color?: string;
  size?: string;
  weight?: string;
  metadata?: Record<string, unknown>; // Changed from any
  country?: string;
  city?: string;
}

export interface ProductFilters {
  page?: number;
  page_size?: number;
  search?: string;
  product_type?: "variant" | "product";
  min_price?: number;
  max_price?: number;
  currency?: string;
  color?: string;
  size?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ProductListResponse {
  success: boolean;
  items: ProductDocument[];
  pagination: PaginationMeta;
  total_count: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Form data types for components
export interface CreateProductFormData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  features?: string[];
  specification?: Record<string, string>;
  color?: string;
  size?: string;
  weight?: string;
  metadata?: Record<string, string>; // Changed from any
  product_type: "variant" | "product";
  parent_id?: string;
  country?: string;
  city?: string;
}

export interface UpdateProductFormData {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  images?: string[];
  features?: string[];
  specification?: Record<string, string>;
  color?: string;
  size?: string;
  weight?: string;
  metadata?: Record<string, unknown>; // Changed from any
  country?: string;
  city?: string;
}
