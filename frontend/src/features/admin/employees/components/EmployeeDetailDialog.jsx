import { Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { StatusChip } from "../../../../components/common/StatusChip.jsx";

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} textAlign="right">
        {value || "-"}
      </Typography>
    </Stack>
  );
}

export function EmployeeDetailDialog({ employee, onClose }) {
  return (
    <Dialog open={Boolean(employee)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Employee details</DialogTitle>
      <DialogContent>
        {employee ? (
          <Stack spacing={2} sx={{ py: 1 }}>
            <DetailRow label="Full name" value={employee.fullName} />
            <DetailRow label="Username" value={employee.username} />
            <DetailRow label="Email" value={employee.email} />
            <DetailRow label="Phone" value={employee.phone} />
            <DetailRow label="Department" value={employee.department} />
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Role</Typography>
              <StatusChip status={employee.role} />
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Status</Typography>
              <StatusChip status={employee.status} />
            </Stack>
            <DetailRow
              label="Created at"
              value={employee.createdAt ? dayjs(employee.createdAt).format("YYYY-MM-DD HH:mm") : "-"}
            />
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
