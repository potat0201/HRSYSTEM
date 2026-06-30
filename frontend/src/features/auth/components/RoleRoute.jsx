import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { getDashboardPath, normalizeRole } from "../auth.utils.js";

export function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (normalizeRole(user?.role) !== role) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  return children || <Outlet />;
}
