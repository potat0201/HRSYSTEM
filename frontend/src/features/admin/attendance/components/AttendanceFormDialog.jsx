import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ATTENDANCE_STATUSES } from "../attendance.constants.js";

const attendanceSchema = z.object({
  userId: z.coerce.number().min(1, "Employee is required"),
  attendanceDate: z.string().min(1, "Attendance date is required"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  status: z.enum(["PRESENT", "LATE", "ABSENT"]),
});

function toInputDateTime(value) {
  return value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : "";
}

function getDefaultValues(record) {
  return {
    userId: record?.userId || "",
    attendanceDate: record?.attendanceDate || dayjs().format("YYYY-MM-DD"),
    checkInTime: toInputDateTime(record?.checkInTime),
    checkOutTime: toInputDateTime(record?.checkOutTime),
    status: record?.status || "PRESENT",
  };
}

export function AttendanceFormDialog({ open, record, employees, loading, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: getDefaultValues(record),
  });

  useEffect(() => {
    reset(getDefaultValues(record));
  }, [record, open, reset]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{record ? "Edit attendance" : "Add attendance"}</DialogTitle>
      <DialogContent>
        <Stack component="form" id="attendance-form" spacing={2.2} sx={{ pt: 1 }} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            select
            label="Employee"
            defaultValue={getDefaultValues(record).userId}
            error={Boolean(errors.userId)}
            helperText={errors.userId?.message}
            {...register("userId")}
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id} value={employee.id}>
                {employee.fullName} ({employee.username})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Attendance date"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.attendanceDate)}
            helperText={errors.attendanceDate?.message}
            {...register("attendanceDate")}
          />
          <TextField
            label="Check-in time"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("checkInTime")}
          />
          <TextField
            label="Check-out time"
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("checkOutTime")}
          />
          <TextField select label="Status" defaultValue={getDefaultValues(record).status} {...register("status")}>
            {ATTENDANCE_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" form="attendance-form" variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
