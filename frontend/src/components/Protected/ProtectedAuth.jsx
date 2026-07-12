// src/components/Protected/ProtectedAuth.jsx
// Guards public auth pages (login, forgot-password).
// If user is already authenticated, redirect them to their portal.
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

const ProtectedAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullscreen message="Checking authentication..." />;
  }

  // Already authenticated — redirect to appropriate portal
  if (user) {
    if (user.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/app/dashboard" replace />;
  }

  // Not authenticated — render auth page
  return <Outlet />;
};

export default ProtectedAuth;
