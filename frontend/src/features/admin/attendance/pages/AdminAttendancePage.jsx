import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog.jsx";
import { EmptyState } from "../../../../components/common/EmptyState.jsx";
import { ErrorState } from "../../../../components/common/ErrorState.jsx";
import { LoadingState } from "../../../../components/common/LoadingState.jsx";
import { PageHeader } from "../../../../components/common/PageHeader.jsx";
import { getErrorMessage } from "../../../../services/httpClient.js";
import { useEmployees } from "../../employees/api/employees.api.js";
import {
  useAdminAttendance,
  useCreateManualAttendance,
  useDeleteManualAttendance,
  useUpdateManualAttendance,
} from "../api/attendance.api.js";
import { AttendanceFilter } from "../components/AttendanceFilter.jsx";
import { AttendanceFormDialog } from "../components/AttendanceFormDialog.jsx";
import { AttendanceTable } from "../components/AttendanceTable.jsx";
import { toAttendancePayload } from "../attendance.mapper.js";

export function AdminAttendancePage() {
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState({ fromDate: "", toDate: "", search: "" });
  const [formRecord, setFormRecord] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmRecord, setConfirmRecord] = useState(null);

  const queryFilters = useMemo(
    () => ({
      ...(filters.fromDate ? { fromDate: filters.fromDate } : {}),
      ...(filters.toDate ? { toDate: filters.toDate } : {}),
    }),
    [filters.fromDate, filters.toDate],
  );

  const attendanceQuery = useAdminAttendance(queryFilters);
  const employeesQuery = useEmployees({});
  const createAttendance = useCreateManualAttendance();
  const updateAttendance = useUpdateManualAttendance();
  const deleteAttendance = useDeleteManualAttendance();

  const records = useMemo(() => {
    const list = attendanceQuery.data || [];
    const search = filters.search.trim().toLowerCase();

    if (!search) {
      return list;
    }

    return list.filter((record) =>
      `${record.fullName || ""} ${record.username || ""}`.toLowerCase().includes(search),
    );
  }, [attendanceQuery.data, filters.search]);

  async function handleSubmit(values) {
    try {
      const payload = toAttendancePayload(values);

      if (formRecord) {
        await updateAttendance.mutateAsync({ attendanceId: formRecord.id, payload });
        enqueueSnackbar("Attendance updated", { variant: "success" });
      } else {
        await createAttendance.mutateAsync(payload);
        enqueueSnackbar("Attendance created", { variant: "success" });
      }

      setFormOpen(false);
      setFormRecord(null);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Unable to save attendance"), { variant: "error" });
    }
  }

  async function handleDelete() {
    try {
      await deleteAttendance.mutateAsync(confirmRecord.id);
      enqueueSnackbar("Attendance deleted", { variant: "success" });
      setConfirmRecord(null);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Unable to delete attendance"), { variant: "error" });
    }
  }

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Review and maintain attendance records across employees."
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setFormRecord(null);
              setFormOpen(true);
            }}
          >
            Add record
          </Button>
        }
      />

      <AttendanceFilter filters={filters} onChange={setFilters} />

      {attendanceQuery.isLoading ? <LoadingState message="Loading attendance..." /> : null}
      {attendanceQuery.isError ? (
        <ErrorState message={getErrorMessage(attendanceQuery.error)} onRetry={attendanceQuery.refetch} />
      ) : null}
      {attendanceQuery.isSuccess && records.length === 0 ? (
        <EmptyState title="No attendance records" description="No records match the selected filters." />
      ) : null}
      {attendanceQuery.isSuccess && records.length > 0 ? (
        <AttendanceTable
          records={records}
          onEdit={(record) => {
            setFormRecord(record);
            setFormOpen(true);
          }}
          onDelete={setConfirmRecord}
        />
      ) : null}

      <AttendanceFormDialog
        open={formOpen}
        record={formRecord}
        employees={employeesQuery.data || []}
        loading={createAttendance.isPending || updateAttendance.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={Boolean(confirmRecord)}
        title="Delete attendance"
        description="Delete this attendance record?"
        confirmText="Delete"
        loading={deleteAttendance.isPending}
        onClose={() => setConfirmRecord(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
