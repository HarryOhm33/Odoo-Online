// src/components/Protected/AdminRoute.jsx
// Guards /admin/* routes — only allows Admin role.
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

const ADMIN_ROLES = ["Admin"];
const EMPLOYEE_ROLES = ["Employee", "DepartmentHead", "AssetManager"];

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullscreen message="Verifying access..." />;
  }

  // Not authenticated → login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Employee trying to access admin → redirect to their portal
  if (EMPLOYEE_ROLES.includes(user.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // Not Admin → 403
  if (!ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
