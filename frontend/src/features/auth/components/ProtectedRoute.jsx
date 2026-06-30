import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "../../../services/tokenStorage.js";

export function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
}
