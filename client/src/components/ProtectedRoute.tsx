import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  // Expects children prop
  children: ReactNode; // This tells TypeScript what props this component expects and protected page will be wrapped
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth(); // Gets current login status from context

  if (isLoading == true) {
    // 'While checking authentication status'
    return <div>Loading...</div>;
  }

  if (isAuthenticated == false) {
    // 'If user is not logged in' it will redirect page
    return <Navigate to="/login" replace />; // 'replace' preventss back button issues
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// ONLY WRAP THE ELEMENTS OF ADMIN-ONLY PAGES (DASHBOARD)
