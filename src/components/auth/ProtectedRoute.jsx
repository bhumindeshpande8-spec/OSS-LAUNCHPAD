import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner label="Checking your session" className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
