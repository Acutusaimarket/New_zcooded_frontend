import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { authApiEndPoint } from "@/lib/api-end-point";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import type { LoginResponse } from "../../types";
import type { LoginSchemaType } from "../../types/schema.type";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginSchemaType) => {
      try {
        const response = await axiosInstance.post<LoginResponse>(
          authApiEndPoint.login,
          data
        );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          const message =
            error.response?.data?.detail || "An error occurred during login.";
          throw new Error(message);
        }
      }
    },
    onSuccess: (data) => {
      // const { user } = data;
      if (!data?.user) {
        throw new Error("User data is missing in the response.");
      }
      useAuthStore.getState().setAuth(data?.user);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Redirect to persona studio or intended page
      const redirectTo =
        sessionStorage.getItem("redirectAfterLogin") ||
        "/dashboard/persona-studio";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    },
  });
};
