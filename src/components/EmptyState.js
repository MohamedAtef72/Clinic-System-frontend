import React from "react";
import { Box, Typography } from "@mui/material";
import { GOLD, GOLD_BG, TEXT_MID } from "../theme/tokens";

export default function EmptyState({ icon: Icon, title = "No Data Found", message = "We couldn't find anything matching your criteria.", minHeight = "50vh" }) {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight,
      textAlign: "center",
      py: 8,
      px: 3,
      borderRadius: 4,
      border: "1px dashed rgba(184,151,42,0.3)",
      bgcolor: GOLD_BG,
      width: "100%",
    }}>
      {Icon && <Icon sx={{ fontSize: 56, color: `${GOLD}66`, mb: 2 }} />}
      <Typography variant="h6" sx={{ fontWeight: 700, color: GOLD, mb: 1 }}>{title}</Typography>
      <Typography sx={{ color: TEXT_MID, fontWeight: 500, maxWidth: 400 }}>{message}</Typography>
    </Box>
  );
}
