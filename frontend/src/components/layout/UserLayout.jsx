import { Box, Container } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, drawerWidth } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";

const userItems = [
  { label: "Dashboard", to: "/user/dashboard", icon: "dashboard" },
  { label: "Check-in", to: "/user/check-in", icon: "checkin" },
  { label: "Attendance History", to: "/user/attendance-history", icon: "history" },
  { label: "Profile", to: "/user/profile", icon: "profile" },
];

export function UserLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar items={userItems} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
