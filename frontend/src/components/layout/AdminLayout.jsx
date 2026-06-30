import { Box, Container } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, drawerWidth } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";

const adminItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "dashboard" },
  { label: "Employees", to: "/admin/employees", icon: "employees" },
  { label: "Attendance", to: "/admin/attendance", icon: "attendance" },
];

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar items={adminItems} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
