import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function PatientCardSkeleton() {
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
        height: "100%",
        minHeight: 280,
      }}
    >
      <CardContent sx={{ pt: 4, px: 3, pb: 3, display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="circular" width={70} height={70} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="text" width="50%" height={24} />
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="85%" />
          <Skeleton variant="text" width="60%" />
        </Box>

        <Box sx={{ mt: "auto", pt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Skeleton variant="rectangular" width="40%" height={40} sx={{ borderRadius: 50 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
