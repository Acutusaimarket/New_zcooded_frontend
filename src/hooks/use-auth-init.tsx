import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { authApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import type { UserType } from "@/types/user.type";

export const useAuthInit = () => {
  const queryClient = useQueryClient();
  const { isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;

    const initAuth = async () => {
      try {
        const userData = await axiosPrivateInstance.get<UserType>(
          authApiEndPoint.getUserInfo,
          {
            withCredentials: true,
          }
        );

        useAuthStore.getState().setAuth(userData.data);
        queryClient.setQueryData(["user"], userData);
      } catch {
        useAuthStore.getState().logout();
      }
    };

    initAuth();
  }, [queryClient, isInitialized]);
};
