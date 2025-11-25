import { Navigate, useLocation } from "react-router";

import { useAuthStore } from "@/store/auth-store";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const location = useLocation();

  // Show loading while checking authentication status
  if (!isInitialized) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    // Store the attempted URL for redirect after login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
};
