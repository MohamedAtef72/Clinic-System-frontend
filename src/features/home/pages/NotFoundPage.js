import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HomeIcon from "@mui/icons-material/Home";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";

export default function NotFoundPage() {
  usePageTitle("Page Not Found");
  const navigate = useNavigate();

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
      {/* Logo mark */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${GOLD_LIGHT}, #fdf3d0)`,
          border: `2px solid ${GOLD}40`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 32px ${GOLD}25`,
        }}
      >
        <LocalHospitalIcon sx={{ color: GOLD, fontSize: 36 }} />
      </Box>

      {/* 404 text */}
      <Typography
        sx={{
          fontSize: { xs: "5rem", sm: "7rem" },
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-4px",
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </Typography>

      {/* Message */}
      <Box sx={{ textAlign: "center", maxWidth: 440 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: TEXT_DARK, mb: 1, letterSpacing: "-0.3px" }}
        >
          Page not found
        </Typography>
        <Typography sx={{ color: TEXT_MID, fontSize: "0.95rem", lineHeight: 1.7 }}>
          The page you're looking for doesn't exist or has been moved. Please
          check the URL or head back home.
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Button
          onClick={() => navigate("/")}
          startIcon={<HomeIcon />}
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
          Go Home
        </Button>
        <Button
          onClick={() => navigate(-1)}
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
          Go Back
        </Button>
      </Box>
    </Box>
  );
}
