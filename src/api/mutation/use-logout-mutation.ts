import { QueryClient, useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { authApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

const useLogoutMutation = () => {
  const queryClient = new QueryClient();
  const navigation = useNavigate();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosPrivateInstance.post(
          authApiEndPoint.logout
        );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(error.response?.data?.detail || "Logout failed");
        }
        throw new Error("An unexpected error occurred during logout");
      }
    },
    onSuccess: () => {
      queryClient.clear();
      useAuthStore.getState().logout();
      navigation("/login");
    },
    onError: (error) => {
      // console.error("Logout error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Logout failed. Please try again."
      );
    },
  });
};

export default useLogoutMutation;
