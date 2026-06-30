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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { USER_ROLES, USER_STATUSES } from "../employee.constants.js";

const baseSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  department: z.string().optional(),
  role: z.enum(["ADMIN", "EMPLOYEE"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

const createSchema = baseSchema.extend({
  password: z.string().min(6, "Password must have at least 6 characters"),
});

function getDefaultValues(employee) {
  return {
    username: employee?.username || "",
    password: "",
    fullName: employee?.fullName || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    department: employee?.department || "",
    role: employee?.role || "EMPLOYEE",
    status: employee?.status || "ACTIVE",
  };
}

export function EmployeeFormDialog({ open, employee, loading, onClose, onSubmit }) {
  const isEdit = Boolean(employee);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? baseSchema : createSchema),
    defaultValues: getDefaultValues(employee),
  });

  useEffect(() => {
    reset(getDefaultValues(employee));
  }, [employee, open, reset]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit employee" : "Add employee"}</DialogTitle>
      <DialogContent>
        <Stack component="form" id="employee-form" spacing={2.2} sx={{ pt: 1 }} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            disabled={isEdit}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
            {...register("username")}
          />
          {!isEdit ? (
            <TextField
              label="Password"
              type="password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register("password")}
            />
          ) : null}
          <TextField
            label="Full name"
            error={Boolean(errors.fullName)}
            helperText={errors.fullName?.message}
            {...register("fullName")}
          />
          <TextField
            label="Email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField label="Phone" {...register("phone")} />
          <TextField label="Department" {...register("department")} />
          <TextField select label="Role" defaultValue={getDefaultValues(employee).role} {...register("role")}>
            {USER_ROLES.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <TextField select label="Status" defaultValue={getDefaultValues(employee).status} {...register("status")}>
            {USER_STATUSES.map((status) => (
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
        <Button type="submit" form="employee-form" variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
