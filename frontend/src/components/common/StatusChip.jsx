import { Chip } from "@mui/material";

const STATUS_COLOR = {
  ACTIVE: "success",
  INACTIVE: "default",
  PRESENT: "success",
  NORMAL: "success",
  LATE: "warning",
  ABSENT: "error",
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
  CANCELLED: "default",
  ADMIN: "primary",
  EMPLOYEE: "default",
};

export function StatusChip({ status, size = "small" }) {
  const label = status || "UNKNOWN";
  const color = STATUS_COLOR[String(label).toUpperCase()] || "default";

  return <Chip label={label} color={color} size={size} variant={color === "default" ? "outlined" : "filled"} />;
}
