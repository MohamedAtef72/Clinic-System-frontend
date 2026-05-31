import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function AppointmentCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid rgba(184,151,42,0.15)`,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        width: 320,
        height: 380,
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 4 }} />
      </Box>

      <CardContent sx={{ pt: 3, px: 3, pb: 3, display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="circular" width={50} height={50} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="85%" />
          <Skeleton variant="text" width="70%" />
        </Box>

        <Box sx={{ mt: "auto", display: "flex", gap: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 50 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
