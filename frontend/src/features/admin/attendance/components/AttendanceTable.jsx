import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
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

function formatDateTime(value) {
  return value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "-";
}

export function AttendanceTable({ records, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} hover>
              <TableCell>{record.fullName}</TableCell>
              <TableCell>{record.username}</TableCell>
              <TableCell>{record.attendanceDate}</TableCell>
              <TableCell className="nowrap">{formatDateTime(record.checkInTime)}</TableCell>
              <TableCell className="nowrap">{formatDateTime(record.checkOutTime)}</TableCell>
              <TableCell>
                <StatusChip status={record.status} />
              </TableCell>
              <TableCell className="nowrap">{formatDateTime(record.updatedAt)}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(record)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => onDelete(record)}>
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
