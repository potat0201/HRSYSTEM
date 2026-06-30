import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { EmptyState } from "../../../../components/common/EmptyState.jsx";
import { LoadingState } from "../../../../components/common/LoadingState.jsx";
import { PageHeader } from "../../../../components/common/PageHeader.jsx";
import { StatusChip } from "../../../../components/common/StatusChip.jsx";
import { useAuth } from "../../../auth/hooks/useAuth.js";
import { useMyAttendanceHistory } from "../../../admin/attendance/api/attendance.api.js";

export function UserDashboardPage() {
  const { user } = useAuth();
  const historyQuery = useMyAttendanceHistory(user?.userId);
  const today = dayjs().format("YYYY-MM-DD");
  const todayRecord = (historyQuery.data || []).find((record) => record.attendanceDate === today);

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.fullName || user?.username || "there"}`}
        description="Track your daily attendance and review recent history."
      />

      <Stack spacing={3}>
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
              <EventAvailableIcon color="primary" fontSize="large" />
              <Stack sx={{ flexGrow: 1 }} spacing={0.5}>
                <Typography variant="h6" fontWeight={900}>
                  Today status
                </Typography>
                {historyQuery.isLoading ? <LoadingState message="Checking today status..." /> : null}
                {!historyQuery.isLoading && todayRecord ? (
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <StatusChip status={todayRecord.status} />
                    <Typography color="text.secondary">
                      Check-in: {todayRecord.checkInTime ? dayjs(todayRecord.checkInTime).format("HH:mm") : "-"}
                    </Typography>
                    <Typography color="text.secondary">
                      Check-out: {todayRecord.checkOutTime ? dayjs(todayRecord.checkOutTime).format("HH:mm") : "-"}
                    </Typography>
                  </Stack>
                ) : null}
                {!historyQuery.isLoading && !todayRecord ? (
                  <Typography color="text.secondary">No attendance record for today.</Typography>
                ) : null}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button component={Link} to="/user/check-in" variant="contained" startIcon={<PunchClockIcon />}>
            Go to check-in
          </Button>
          <Button component={Link} to="/user/attendance-history" variant="outlined" startIcon={<HistoryIcon />}>
            View history
          </Button>
        </Stack>

        {historyQuery.isSuccess && historyQuery.data.length === 0 ? (
          <EmptyState title="No history yet" description="Your attendance history will appear here." />
        ) : null}
      </Stack>
    </>
  );
}
