import SearchIcon from "@mui/icons-material/Search";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { USER_STATUSES } from "../employee.constants.js";

export function EmployeeFilter({ filters, onChange }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
      <TextField
        label="Search full name"
        value={filters.fullName}
        onChange={(event) => onChange({ ...filters, fullName: event.target.value })}
        sx={{ minWidth: 280 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          {USER_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
