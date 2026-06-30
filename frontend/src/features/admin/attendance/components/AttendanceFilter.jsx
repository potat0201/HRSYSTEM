import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, Stack, TextField } from "@mui/material";

export function AttendanceFilter({ filters, onChange }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
      <TextField
        label="From date"
        type="date"
        value={filters.fromDate}
        onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="To date"
        type="date"
        value={filters.toDate}
        onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Search employee"
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        sx={{ minWidth: 280 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
