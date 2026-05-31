import React from "react";
import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function DoctorCardSkeleton() {
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
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Skeleton variant="rectangular" height={160} />
        {/* Avatar skeleton */}
        <Box sx={{ position: "absolute", bottom: -40, left: 24 }}>
          <Skeleton variant="circular" width={80} height={80} sx={{ border: "4px solid #fff" }} />
        </Box>
      </Box>

      <CardContent sx={{ pt: 6, px: 3, pb: 3, display: "flex", flexDirection: "column", gap: 1.5, flexGrow: 1 }}>
        <Skeleton variant="text" width="70%" height={32} />
        <Skeleton variant="text" width="40%" height={24} />

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="85%" />
          <Skeleton variant="text" width="60%" />
        </Box>

        <Box sx={{ mt: "auto", pt: 2, display: "flex", gap: 2 }}>
          <Skeleton variant="rectangular" width="50%" height={40} sx={{ borderRadius: 50 }} />
          <Skeleton variant="rectangular" width="50%" height={40} sx={{ borderRadius: 50 }} />
        </Box>
      </CardContent>
    </Card>
  );
}
