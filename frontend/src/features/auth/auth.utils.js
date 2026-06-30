export function normalizeRole(role) {
  return String(role || "").toUpperCase() === "ADMIN" ? "admin" : "user";
}

export function getDashboardPath(user) {
  return normalizeRole(user?.role) === "admin" ? "/admin/dashboard" : "/user/dashboard";
}
