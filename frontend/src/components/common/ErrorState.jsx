import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Alert, Button, Stack } from "@mui/material";

export function ErrorState({ message = "Unable to load data", onRetry }) {
  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      <Alert severity="error" icon={<ReportProblemOutlinedIcon />}>
        {message}
      </Alert>
      {onRetry ? (
        <Button variant="outlined" onClick={onRetry} sx={{ alignSelf: "flex-start" }}>
          Retry
        </Button>
      ) : null}
    </Stack>
  );
}
