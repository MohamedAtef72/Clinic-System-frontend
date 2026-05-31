import { Box, CircularProgress } from "@mui/material";
import { GOLD } from "../theme/tokens";

/**
 * Full-viewport centered loading overlay.
 * Used by Suspense fallback and ProtectedRoute while auth state resolves.
 */
export default function FullPageSpinner() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(249,248,245,0.92)",
        zIndex: 9999,
        backdropFilter: "blur(6px)",
      }}
    >
      <CircularProgress sx={{ color: GOLD }} size={44} thickness={4} />
    </Box>
  );
}
