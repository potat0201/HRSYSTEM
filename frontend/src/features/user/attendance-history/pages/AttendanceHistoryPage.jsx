import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { EmptyState } from "../../../../components/common/EmptyState.jsx";
import { ErrorState } from "../../../../components/common/ErrorState.jsx";
import { LoadingState } from "../../../../components/common/LoadingState.jsx";
import { PageHeader } from "../../../../components/common/PageHeader.jsx";
import { StatusChip } from "../../../../components/common/StatusChip.jsx";
import { getErrorMessage } from "../../../../services/httpClient.js";
import { useMyAttendanceHistory } from "../../../admin/attendance/api/attendance.api.js";
import { useAuth } from "../../../auth/hooks/useAuth.js";

export function AttendanceHistoryPage() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState("");
  const historyQuery = useMyAttendanceHistory(user?.userId);

  const records = useMemo(() => {
    if (!dateFilter) {
      return historyQuery.data || [];
    }
    return (historyQuery.data || []).filter((record) => record.attendanceDate === dateFilter);
  }, [historyQuery.data, dateFilter]);

  return (
    <>
      <PageHeader title="Attendance history" description="Review your check-in and check-out records." />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Filter date"
          type="date"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      {historyQuery.isLoading ? <LoadingState message="Loading history..." /> : null}
      {historyQuery.isError ? (
        <ErrorState message={getErrorMessage(historyQuery.error)} onRetry={historyQuery.refetch} />
      ) : null}
      {historyQuery.isSuccess && records.length === 0 ? (
        <EmptyState title="No attendance history" description="No records match the selected date." />
      ) : null}
      {historyQuery.isSuccess && records.length > 0 ? (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.attendanceDate}</TableCell>
                  <TableCell>{record.checkInTime ? dayjs(record.checkInTime).format("YYYY-MM-DD HH:mm") : "-"}</TableCell>
                  <TableCell>{record.checkOutTime ? dayjs(record.checkOutTime).format("YYYY-MM-DD HH:mm") : "-"}</TableCell>
                  <TableCell>
                    <StatusChip status={record.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </>
  );
}
