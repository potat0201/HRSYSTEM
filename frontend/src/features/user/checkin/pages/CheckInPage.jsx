import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { ErrorState } from "../../../../components/common/ErrorState.jsx";
import { LoadingState } from "../../../../components/common/LoadingState.jsx";
import { PageHeader } from "../../../../components/common/PageHeader.jsx";
import { StatusChip } from "../../../../components/common/StatusChip.jsx";
import { getErrorMessage } from "../../../../services/httpClient.js";
import { useCheckIn, useCheckOut, useMyAttendanceHistory } from "../../../admin/attendance/api/attendance.api.js";
import { useAuth } from "../../../auth/hooks/useAuth.js";

export function CheckInPage() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const historyQuery = useMyAttendanceHistory(user?.userId);
  const checkIn = useCheckIn();
  const checkOut = useCheckOut();
  const today = dayjs().format("YYYY-MM-DD");
  const todayRecord = (historyQuery.data || []).find((record) => record.attendanceDate === today);

  async function handleCheckIn() {
    try {
      await checkIn.mutateAsync({ userId: user.userId });
      enqueueSnackbar("Check-in successful", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Unable to check in"), { variant: "error" });
    }
  }

  async function handleCheckOut() {
    try {
      await checkOut.mutateAsync({ userId: user.userId });
      enqueueSnackbar("Check-out successful", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Unable to check out"), { variant: "error" });
    }
  }

  return (
    <>
      <PageHeader title="Check-in" description={dayjs().format("dddd, YYYY-MM-DD")} />

      {historyQuery.isLoading ? <LoadingState message="Loading today attendance..." /> : null}
      {historyQuery.isError ? (
        <ErrorState message={getErrorMessage(historyQuery.error)} onRetry={historyQuery.refetch} />
      ) : null}

      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", maxWidth: 720 }}>
        <CardContent>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={900}>
                {user?.fullName || user?.username}
              </Typography>
              <Typography color="text.secondary">User ID: {user?.userId}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography color="text.secondary">Today record</Typography>
              {todayRecord ? (
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                  <StatusChip status={todayRecord.status} />
                  <Typography>Check-in: {todayRecord.checkInTime ? dayjs(todayRecord.checkInTime).format("HH:mm") : "-"}</Typography>
                  <Typography>Check-out: {todayRecord.checkOutTime ? dayjs(todayRecord.checkOutTime).format("HH:mm") : "-"}</Typography>
                </Stack>
              ) : (
                <Typography fontWeight={700}>No check-in yet.</Typography>
              )}
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleCheckIn}
                disabled={checkIn.isPending}
              >
                {checkIn.isPending ? "Checking in..." : "Check-in"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleCheckOut}
                disabled={checkOut.isPending}
              >
                {checkOut.isPending ? "Checking out..." : "Check-out"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
