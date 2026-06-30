import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Card, CardContent, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { ErrorState } from "../../../../components/common/ErrorState.jsx";
import { LoadingState } from "../../../../components/common/LoadingState.jsx";
import { PageHeader } from "../../../../components/common/PageHeader.jsx";
import { StatusChip } from "../../../../components/common/StatusChip.jsx";
import { getErrorMessage } from "../../../../services/httpClient.js";
import { useAdminAttendance } from "../../attendance/api/attendance.api.js";
import { useEmployees } from "../../employees/api/employees.api.js";

function MetricCard({ title, value, icon, tone = "primary" }) {
  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: `${tone}.50`,
              color: `${tone}.main`,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={900}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPage() {
  const today = dayjs().format("YYYY-MM-DD");
  const employeesQuery = useEmployees({});
  const attendanceQuery = useAdminAttendance({});

  const employees = employeesQuery.data || [];
  const attendance = attendanceQuery.data || [];
  const todayAttendance = attendance.filter((record) => record.attendanceDate === today);
  const todayLate = todayAttendance.filter((record) => record.status === "LATE");

  return (
    <>
      <PageHeader
        title="Admin dashboard"
        description="Operational view for employee records and daily attendance."
      />

      {(employeesQuery.isLoading || attendanceQuery.isLoading) ? <LoadingState /> : null}
      {(employeesQuery.isError || attendanceQuery.isError) ? (
        <ErrorState
          message={getErrorMessage(employeesQuery.error || attendanceQuery.error)}
          onRetry={() => {
            employeesQuery.refetch();
            attendanceQuery.refetch();
          }}
        />
      ) : null}

      {employeesQuery.isSuccess && attendanceQuery.isSuccess ? (
        <Stack spacing={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            <MetricCard title="Total employees" value={employees.length} icon={<PeopleAltIcon />} />
            <MetricCard
              title="Active"
              value={employees.filter((employee) => employee.status === "ACTIVE").length}
              icon={<PeopleAltIcon />}
              tone="success"
            />
            <MetricCard
              title="Inactive"
              value={employees.filter((employee) => employee.status === "INACTIVE").length}
              icon={<PersonOffIcon />}
              tone="error"
            />
            <MetricCard title="Today records" value={todayAttendance.length} icon={<EventNoteIcon />} />
            <MetricCard title="Late today" value={todayLate.length} icon={<WarningAmberIcon />} tone="warning" />
          </Box>

          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography fontWeight={900}>Recent attendance</Typography>
            </Box>
            {attendance.length === 0 ? (
              <Stack alignItems="center" spacing={1} sx={{ py: 5 }}>
                <EventBusyIcon color="disabled" />
                <Typography color="text.secondary">No attendance records yet.</Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.slice(0, 8).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.fullName}</TableCell>
                      <TableCell>{record.attendanceDate}</TableCell>
                      <TableCell>
                        {record.checkInTime ? dayjs(record.checkInTime).format("HH:mm") : "-"}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={record.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Stack>
      ) : null}
    </>
  );
}
