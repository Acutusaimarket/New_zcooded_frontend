import { Navigate } from "react-router";

import { useAuthGuard } from "@/hooks/use-auth-guard";

export const RoleProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) => {
  const { user, isInitialized, isLoading } = useAuthGuard();

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !user.role?.includes(requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
