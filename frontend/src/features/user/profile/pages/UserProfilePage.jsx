import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../../components/common/PageHeader.jsx";
import { StatusChip } from "../../../../components/common/StatusChip.jsx";
import { useAuth } from "../../../auth/hooks/useAuth.js";

function ProfileRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={800} textAlign="right">
        {value || "-"}
      </Typography>
    </Stack>
  );
}

export function UserProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <PageHeader title="Profile" description="Basic account details from your current session." />
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", maxWidth: 640 }}>
        <CardContent>
          <Stack spacing={2}>
            <ProfileRow label="User ID" value={user?.userId} />
            <ProfileRow label="Username" value={user?.username} />
            <ProfileRow label="Full name" value={user?.fullName} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography color="text.secondary">Role</Typography>
              <StatusChip status={user?.role} />
            </Stack>
            <Divider />
            <Button startIcon={<LogoutIcon />} color="error" variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
