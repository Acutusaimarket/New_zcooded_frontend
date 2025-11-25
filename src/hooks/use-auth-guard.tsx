import { useGetAuthenticatedUser } from "@/api/query/use-get-user";
import { useAuthStore } from "@/store/auth-store";

// 7. Auth Guard Hook
export const useAuthGuard = () => {
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const { data: userData, isLoading } = useGetAuthenticatedUser();

  return {
    isAuthenticated,
    user: userData || user,
    isLoading,
    isInitialized,
  };
};
