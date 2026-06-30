import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import { StatusChip } from "../../../../components/common/StatusChip.jsx";

export function EmployeeTable({
  employees,
  onView,
  onEdit,
  onDeactivate,
  onGrantAdmin,
  onRevokeAdmin,
}) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} hover>
              <TableCell>{employee.fullName}</TableCell>
              <TableCell>{employee.username}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone || "-"}</TableCell>
              <TableCell>{employee.department || "-"}</TableCell>
              <TableCell>
                <StatusChip status={employee.role} />
              </TableCell>
              <TableCell>
                <StatusChip status={employee.status} />
              </TableCell>
              <TableCell className="nowrap">
                {employee.createdAt ? dayjs(employee.createdAt).format("YYYY-MM-DD HH:mm") : "-"}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="View details">
                    <IconButton size="small" onClick={() => onView(employee)}>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(employee)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={employee.role === "ADMIN" ? "Revoke admin" : "Grant admin"}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        employee.role === "ADMIN" ? onRevokeAdmin(employee) : onGrantAdmin(employee)
                      }
                    >
                      {employee.role === "ADMIN" ? (
                        <PersonRemoveIcon fontSize="small" />
                      ) : (
                        <AdminPanelSettingsIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deactivate">
                    <IconButton size="small" color="error" onClick={() => onDeactivate(employee)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
