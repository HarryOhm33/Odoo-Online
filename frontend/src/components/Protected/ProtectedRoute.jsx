// src/components/Protected/ProtectedRoute.jsx
// Guards /app/* routes — allows Employee, DepartmentHead, AssetManager.
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

const EMPLOYEE_ROLES = ["Employee", "DepartmentHead", "AssetManager"];

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullscreen message="Verifying access..." />;
  }

  // Not authenticated → login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Admin trying to access employee portal → admin dashboard
  if (user.role === "Admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Not an employee-type role → 403
  if (!EMPLOYEE_ROLES.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
