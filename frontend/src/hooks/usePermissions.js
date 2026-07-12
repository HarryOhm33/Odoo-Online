// src/hooks/usePermissions.js
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../config/permissions";

/**
 * Custom hook to check if the current user has a specific permission.
 */
const usePermissions = () => {
  const { user } = useAuth();

  const can = (permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  return { can, role: user?.role };
};

export default usePermissions;
