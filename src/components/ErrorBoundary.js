import { Component } from "react";
import { Box, Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RefreshIcon from "@mui/icons-material/Refresh";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../theme/tokens";

/**
 * Top-level error boundary.
 * Catches any uncaught render/lifecycle exceptions and displays a user-friendly
 * fallback instead of a blank white screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an unhandled error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f9f8f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 3,
          px: 3,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${GOLD_BG}, #fdf3d0)`,
            border: `2px solid ${GOLD}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 32px ${GOLD}25`,
          }}
        >
          <WarningAmberIcon sx={{ color: GOLD, fontSize: 36 }} />
        </Box>

        {/* Heading */}
        <Box sx={{ textAlign: "center", maxWidth: 480 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", mb: 1 }}
          >
            Something went wrong
          </Typography>
          <Typography sx={{ color: TEXT_MID, fontSize: "0.95rem", lineHeight: 1.7 }}>
            An unexpected error occurred. You can try reloading the page or go
            back to the home page.
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            onClick={this.handleReload}
            startIcon={<RefreshIcon />}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 50,
              fontWeight: 700,
              textTransform: "none",
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
              color: "white",
              boxShadow: `0 6px 20px ${GOLD}40`,
              "&:hover": {
                background: GOLD_DARK,
                transform: "translateY(-2px)",
                boxShadow: `0 10px 28px ${GOLD}55`,
              },
              transition: "all 0.25s",
            }}
          >
            Reload Page
          </Button>
          <Button
            onClick={this.handleGoHome}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 50,
              fontWeight: 600,
              textTransform: "none",
              color: GOLD_DARK,
              border: `1.5px solid ${GOLD}55`,
              bgcolor: GOLD_BG,
              "&:hover": {
                bgcolor: `${GOLD}15`,
                borderColor: GOLD,
              },
              transition: "all 0.25s",
            }}
          >
            Go Home
          </Button>
        </Box>
      </Box>
    );
  }
}

export default ErrorBoundary;
