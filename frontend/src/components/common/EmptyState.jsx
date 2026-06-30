import InboxIcon from "@mui/icons-material/Inbox";
import { Box, Stack, Typography } from "@mui/material";

export function EmptyState({ title = "No data", description = "There is nothing to show yet." }) {
  return (
    <Box
      sx={{
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        py: 6,
        px: 2,
      }}
    >
      <Stack alignItems="center" spacing={1}>
        <InboxIcon color="disabled" fontSize="large" />
        <Typography fontWeight={800}>{title}</Typography>
        <Typography color="text.secondary" textAlign="center">
          {description}
        </Typography>
      </Stack>
    </Box>
  );
}
