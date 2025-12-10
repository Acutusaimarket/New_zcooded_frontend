import { useQuery } from "@tanstack/react-query";
import { type AxiosResponse, isAxiosError } from "axios";

import { subscriptionApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

export interface SubscriptionPricing {
  monthly: number;
  yearly: number;
  currency: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  plan_type: "free" | "basic" | "pro" | "enterprise";
  pricing: SubscriptionPricing[];
  max_users: number;
  features: string[];
  credits: number;
  api_access: boolean;
  priority_support: boolean;
  no_of_parallel_simulations: number;
  has_restrictions: boolean;
  is_persona_generation_limited: boolean;
  is_media_simulation_limited: boolean;
  is_concept_simulation_limited: boolean;
  is_chat_simulation_limited: boolean;
  persona_count_limit: number | null;
  concept_count_limit: number | null;
  media_count_limit: number | null;
  chat_count_limit: number | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionDetailsResponse {
  status: number;
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
}

export const useSubscriptionDetailsQuery = () => {
  return useQuery({
    queryKey: ["subscription-details"],
    queryFn: async () => {
      try {
        const response: AxiosResponse<SubscriptionDetailsResponse> =
          await axiosPrivateInstance.get(
            subscriptionApiEndPoint.getSubscriptionDetails
          );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
              error.response?.data?.detail ||
              "Failed to fetch subscription details"
          );
        }
        throw new Error("An unexpected error occurred");
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

