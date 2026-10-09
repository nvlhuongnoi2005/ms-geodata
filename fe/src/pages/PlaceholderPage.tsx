import type { ReactNode } from "react";
import { Paper, Stack, Typography } from "@mui/material";

export function PlaceholderPage({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Paper variant="outlined" sx={{ minHeight: 360, display: "grid", placeItems: "center", p: 4 }}>
      <Stack spacing={1.5} sx={{ maxWidth: 440, textAlign: "center", alignItems: "center" }}>
        <span>{icon}</span>
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Paper>
  );
}
