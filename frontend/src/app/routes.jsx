import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout.jsx";
import { UserLayout } from "../components/layout/UserLayout.jsx";
import { AdminAttendancePage } from "../features/admin/attendance/pages/AdminAttendancePage.jsx";
import { AdminDashboardPage } from "../features/admin/dashboard/pages/AdminDashboardPage.jsx";
import { AdminEmployeesPage } from "../features/admin/employees/pages/AdminEmployeesPage.jsx";
import { LoginPage } from "../features/auth/pages/LoginPage.jsx";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute.jsx";
import { RoleRoute } from "../features/auth/components/RoleRoute.jsx";
import { getDashboardPath } from "../features/auth/auth.utils.js";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { AttendanceHistoryPage } from "../features/user/attendance-history/pages/AttendanceHistoryPage.jsx";
import { CheckInPage } from "../features/user/checkin/pages/CheckInPage.jsx";
import { UserDashboardPage } from "../features/user/dashboard/pages/UserDashboardPage.jsx";
import { UserProfilePage } from "../features/user/profile/pages/UserProfilePage.jsx";
import { getToken } from "../services/tokenStorage.js";

function RootRedirect() {
  const { user } = useAuth();

  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPath(user)} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="employees" element={<AdminEmployeesPage />} />
            <Route path="attendance" element={<AdminAttendancePage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute role="user" />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboardPage />} />
            <Route path="check-in" element={<CheckInPage />} />
            <Route path="attendance-history" element={<AttendanceHistoryPage />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
