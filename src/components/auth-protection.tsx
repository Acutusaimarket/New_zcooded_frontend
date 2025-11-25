import { Navigate } from "react-router";

import { useAuthStore } from "@/store/auth-store";

export const AuthProtection = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/persona-studio" replace />;
  }

  return children;
};
