import type { ProductFitAnalysis } from "@/features/ABTESTING/types";

export interface Product {
  name: string;
  description: string;
  price: number;
  currency: string;
  country: string;
  city: string;
  images: string[];
  features: string[];
  specification: {
    battery: string;
    storage: string;
    ram: string;
  };
  color: string;
  size: string;
  weight: string;
  metadata: {
    warranty: string;
    brand: string;
    model: string;
  };
  product_type: string;
  _id: string;
  created_at: string;
  updated_at: string;
}

export interface Persona {
  _id: string;
  name: string;
  description: string;
  goals?: string[];
  challenges?: string[];
  pain_points?: string[];
  preferences?: string[];
  communication_style?: string;
}

export interface ABTestHistoryItem {
  _id: string;
  test_name: string;
  products: Product[];
  persona: Persona;
  product_fit_analysis: ProductFitAnalysis[];
  statistical_results: {
    winning_variant: string;
    p_value: number | null;
    confidence_interval: number[] | null;
    effect_size: number;
    is_significant: boolean;
    control_conversion_rate: number;
    treatment_conversion_rates: Record<string, number>;
  };
  recommended_variant: {
    id: string;
    collection: string;
  };
  sample_size: number;
  confidence_level: number;
  created_at: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context_layer?: Record<string, Array<Record<string, any>>>;
}

export interface ABTestHistoryFilters {
  status?: "completed" | "running" | "failed" | "cancelled";
  date_range?: {
    start_date: string;
    end_date: string;
  };
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ABTestHistoryStats {
  total_tests: number;
  completed_tests: number;
  running_tests: number;
  failed_tests: number;
  average_conversion_rate: number;
  significant_tests: number;
  total_participants: number;
  success_rate: number;
}

export interface ABTestHistoryResponse {
  success: boolean;
  items: ABTestHistoryItem[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  total_count: number;
}

export type ABTestHistoryApiResponse = ABTestHistoryResponse;
