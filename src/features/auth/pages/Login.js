import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, TextField, Box, Typography, Alert, CircularProgress, IconButton, InputAdornment, Link, Divider } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
const BORDER_CLR = "rgba(184,151,42,0.25)";

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

/* ── Trust bullet points shown on the left panel ── */
const TRUST_POINTS = [
  "HIPAA-compliant and secure",
  "256-bit end-to-end encryption",
  "99.9% uptime guarantee",
  "Trusted by 500+ clinics",
];

export default function Login() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    if (isAuthenticated === true) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setSuccessMessage("");
      await login(data);
      setSuccessMessage("Login successful! Redirecting…");
      setTimeout(() => navigate("/", { replace: true }), 1500);
    } catch (err) {
      const status = err.status;
      setServerError(
        status === 400 || status === 401
          ? err.message
          : "Login failed. Please check your Network."
      );
    }
  };

  if (isAuthenticated === true) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Already logged in. Redirecting…</Typography>
      </Box>
    );
  }

  return (
    <>
      <style>{`
        @keyframes panelFadeIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes formFadeIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes shimmerGold {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes spinnerFade {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* gold focus ring on MUI inputs */
        .gold-input .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
          border-color: ${GOLD} !important;
        }
        .gold-input .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
          border-color: ${GOLD} !important;
          border-width: 2px !important;
        }
        .gold-input .MuiInputLabel-root.Mui-focused {
          color: ${GOLD} !important;
        }
      `}</style>

      {/*
        ═══════════════════════════════════════════
          Full-viewport split layout
          LEFT  → dark bokeh panel (decorative)
          RIGHT → white form panel
        ═══════════════════════════════════════════
      */}
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "'Inter', sans-serif",
          bgcolor: "#f9f8f5",
          overflowX: "hidden",
        }}
      >
        {/* ─────────────────────────────────────
            LEFT PANEL — dark photo + brand info
        ───────────────────────────────────── */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            width: "44%",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            animation: "panelFadeIn 0.7s ease both",
          }}
        >
          {/* Background photo */}
          <Box
            sx={{
              position: "absolute", inset: 0,
              backgroundImage: "url('/login_panel_bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Dark overlay gradient */}
          <Box
            sx={{
              position: "absolute", inset: 0,
              background:
                "linear-gradient(160deg, rgba(20,18,32,0.55) 0%, rgba(20,18,32,0.75) 60%, rgba(20,18,32,0.92) 100%)",
            }}
          />
          {/* Gold accent line top */}
          <Box
            sx={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />

          {/* Content */}
          <Box sx={{ position: "relative", zIndex: 1, p: { md: 5, lg: 7 } }}>
            {/* Logo */}
            <Box
              onClick={() => navigate("/")}
              sx={{
                display: "inline-flex", alignItems: "center", gap: 1.2,
                cursor: "pointer", mb: 8,
              }}
            >
              <LocalHospitalIcon sx={{ color: GOLD, fontSize: 28 }} />
              <Box>
                <Typography
                  sx={{ fontWeight: 800, fontSize: "1rem", color: "white", lineHeight: 1.1 }}
                >
                  MedClinic
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.58rem", fontWeight: 600, color: GOLD,
                    letterSpacing: "1.5px", textTransform: "uppercase",
                  }}
                >
                  Professional Care
                </Typography>
              </Box>
            </Box>

            {/* Headline */}
            <Typography
              sx={{
                fontSize: { md: "2rem", lg: "2.6rem" },
                fontWeight: 800,
                color: "white",
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
                mb: 1,
              }}
            >
              Your Health,
            </Typography>
            <Typography
              sx={{
                fontSize: { md: "2rem", lg: "2.6rem" },
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
                mb: 3,
                background: `linear-gradient(90deg, ${GOLD}, #f0d070, ${GOLD})`,
                backgroundSize: "200%",
                animation: "shimmerGold 4s ease infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Priority.
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: 340,
                mb: 5,
              }}
            >
              Sign in to access your personalised healthcare dashboard, appointments,
              and medical records — all in one secure place.
            </Typography>

            {/* Trust bullets */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {TRUST_POINTS.map((point) => (
                <Box key={point} sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <CheckCircleOutlineIcon sx={{ color: GOLD, fontSize: 17, flexShrink: 0 }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                    {point}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bottom tagline */}
          <Box
            sx={{
              position: "relative", zIndex: 1,
              p: { md: 5, lg: 7 }, pt: 0,
            }}
          >
            <Box
              sx={{
                height: 1,
                background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)`,
                mb: 3,
              }}
            />
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>
              © 2025 MedClinic Pro. All rights reserved.
            </Typography>
          </Box>
        </Box>

        {/* ─────────────────────────────────────
            RIGHT PANEL — form
        ───────────────────────────────────── */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 3, sm: 6, lg: 10 },
            py: 6,
            animation: "formFadeIn 0.7s 0.1s ease both",
            position: "relative",
          }}
        >
          {/* Mobile logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center", gap: 1, mb: 5, cursor: "pointer",
            }}
          >
            <LocalHospitalIcon sx={{ color: GOLD, fontSize: 26 }} />
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_DARK }}>
              MedClinic <span style={{ color: GOLD }}>Pro</span>
            </Typography>
          </Box>

          <Box sx={{ width: "100%", maxWidth: 420 }}>
            {/* Heading */}
            <Box sx={{ mb: 4 }}>
              {/* Icon circle */}
              <Box
                sx={{
                  width: 56, height: 56,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${GOLD_LIGHT}, #fdf3d0)`,
                  border: `1.5px solid ${GOLD}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  mb: 2.5,
                  animation: "floatY 4s ease-in-out infinite",
                  boxShadow: `0 8px 24px ${GOLD}25`,
                }}
              >
                <LockOutlinedIcon sx={{ color: GOLD, fontSize: 26 }} />
              </Box>

              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", mb: 0.5 }}
              >
                Welcome back
              </Typography>
              <Typography sx={{ color: TEXT_MID, fontSize: "0.92rem" }}>
                Sign in to your MedClinic account
              </Typography>
            </Box>

            {/* Alerts */}
            {serverError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5, borderRadius: 2,
                  border: "1px solid rgba(211,47,47,0.2)",
                  "& .MuiAlert-icon": { color: "#d32f2f" },
                }}
              >
                {serverError}
              </Alert>
            )}
            {successMessage && (
              <Alert
                severity="success"
                sx={{
                  mb: 2.5, borderRadius: 2,
                  border: `1px solid ${GOLD}40`,
                  bgcolor: GOLD_BG,
                  color: GOLD_DARK,
                  "& .MuiAlert-icon": { color: GOLD },
                }}
              >
                {successMessage}
              </Alert>
            )}

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
              {/* Email */}
              <TextField
                className="gold-input"
                fullWidth
                label="Email Address"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: errors.email ? "error.main" : GOLD, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: "#fafafa",
                  },
                }}
              />

              {/* Password */}
              <TextField
                className="gold-input"
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: errors.password ? "error.main" : GOLD, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: TEXT_MID }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: "#fafafa",
                  },
                }}
              />

              {/* Forgot password */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  sx={{
                    color: GOLD, fontSize: "0.82rem", fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  mt: 0.5,
                  py: 1.5,
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  background: isSubmitting
                    ? `${GOLD}88`
                    : `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                  color: "white",
                  boxShadow: `0 6px 24px ${GOLD}40`,
                  letterSpacing: "0.2px",
                  transition: "all 0.28s",
                  "&:hover:not(:disabled)": {
                    background: GOLD_DARK,
                    transform: "translateY(-2px)",
                    boxShadow: `0 10px 32px ${GOLD}55`,
                  },
                  "&:active:not(:disabled)": {
                    transform: "translateY(0)",
                  },
                }}
              >
                {isSubmitting ? (
                  <Box
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.5,
                      animation: "spinnerFade 0.3s ease",
                    }}
                  >
                    <CircularProgress size={18} sx={{ color: "rgba(255,255,255,0.8)" }} />
                    <span>Signing in…</span>
                  </Box>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 0.5 }}>
                <Divider sx={{ flex: 1, borderColor: BORDER_CLR }} />
                <Typography sx={{ color: TEXT_MID, fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                  Don't have an account?
                </Typography>
                <Divider sx={{ flex: 1, borderColor: BORDER_CLR }} />
              </Box>

              {/* Register link */}
              <Button
                fullWidth
                onClick={() => navigate("/patient-register")}
                sx={{
                  py: 1.4,
                  borderRadius: 50,
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  textTransform: "none",
                  color: GOLD_DARK,
                  border: `1.5px solid ${GOLD}55`,
                  bgcolor: GOLD_BG,
                  "&:hover": {
                    bgcolor: GOLD_LIGHT,
                    borderColor: GOLD,
                    transform: "translateY(-1px)",
                    boxShadow: `0 6px 20px ${GOLD}25`,
                  },
                  transition: "all 0.25s",
                }}
              >
                Create a Patient Account
              </Button>
            </Box>

            {/* Bottom note */}
            <Typography
              sx={{
                mt: 4, textAlign: "center",
                color: "rgba(74,74,106,0.5)", fontSize: "0.72rem",
              }}
            >
              By signing in you agree to our{" "}
              <Link
                href="#"
                sx={{ color: GOLD, textDecoration: "none", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                sx={{ color: GOLD, textDecoration: "none", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
              >
                Privacy Policy
              </Link>
              .
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
