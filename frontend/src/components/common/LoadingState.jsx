import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export function LoadingState({ message = "Loading data..." }) {
  return (
    <Box sx={{ py: 8 }}>
      <Stack alignItems="center" spacing={2}>
        <CircularProgress />
        <Typography color="text.secondary">{message}</Typography>
      </Stack>
    </Box>
  );
}
