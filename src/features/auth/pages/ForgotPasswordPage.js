import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, CircularProgress, InputAdornment, Link, Divider } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockResetIcon from "@mui/icons-material/LockReset";
import { forgotPassword } from '../../../services/authService';
import { useNavigate } from "react-router-dom";

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
const BORDER_CLR = "rgba(184,151,42,0.25)";

const STEPS = [
  { icon: <MailOutlineIcon />, label: "Enter your email address" },
  { icon: <SendIcon />, label: "Receive a secure reset link" },
  { icon: <LockResetIcon />, label: "Create a new password" },
];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }
    setMessage("");
    setMessageType("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage(
        "If this email exists, please check your inbox to reset your password."
      );
      setMessageType("success");
      setSent(true);
      setEmail("");
    } catch (error) {
      const msg =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred while sending the reset request. Please try again.";
      setMessage(msg);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

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
        @keyframes successPop {
          0%   { transform: scale(0.7); opacity: 0; }
          80%  { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
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

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "'Inter', sans-serif",
          bgcolor: "#f9f8f5",
          overflowX: "hidden",
        }}
      >
        {/* ── LEFT PANEL ── */}
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
          {/* Background */}
          <Box
            sx={{
              position: "absolute", inset: 0,
              backgroundImage: "url('/login_panel_bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Box
            sx={{
              position: "absolute", inset: 0,
              background:
                "linear-gradient(160deg, rgba(20,18,32,0.55) 0%, rgba(20,18,32,0.78) 60%, rgba(20,18,32,0.94) 100%)",
            }}
          />
          {/* top gold line */}
          <Box
            sx={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            }}
          />

          {/* Content */}
          <Box sx={{ position: "relative", zIndex: 1, p: { md: 5, lg: 7 } }}>
            {/* Logo */}
            <Box
              onClick={() => navigate("/")}
              sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, cursor: "pointer", mb: 8 }}
            >
              <LocalHospitalIcon sx={{ color: GOLD, fontSize: 28 }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "white", lineHeight: 1.1 }}>
                  MedClinic
                </Typography>
                <Typography sx={{ fontSize: "0.58rem", fontWeight: 600, color: GOLD, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Professional Care
                </Typography>
              </Box>
            </Box>

            {/* Headline */}
            <Typography sx={{ fontSize: { md: "2rem", lg: "2.5rem" }, fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: "-0.5px", mb: 1 }}>
              Recover Your
            </Typography>
            <Typography
              sx={{
                fontSize: { md: "2rem", lg: "2.5rem" }, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px", mb: 3,
                background: `linear-gradient(90deg, ${GOLD}, #f0d070, ${GOLD})`,
                backgroundSize: "200%",
                animation: "shimmerGold 4s ease infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Account Access.
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: 340, mb: 6 }}>
              Forgot your password? No problem. Follow these 3 simple steps to
              securely regain access to your healthcare account.
            </Typography>

            {/* Steps */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {STEPS.map((step, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${GOLD}33, ${GOLD}66)`,
                      border: `1px solid ${GOLD}55`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(step.icon, { sx: { color: GOLD, fontSize: 18 } })}
                  </Box>
                  <Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                      Step {i + 1}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", fontWeight: 500 }}>
                      {step.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Security note */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mt: 6, p: 2, borderRadius: 2, bgcolor: `${GOLD}12`, border: `1px solid ${GOLD}25` }}>
              <ShieldOutlinedIcon sx={{ color: GOLD, fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", lineHeight: 1.5 }}>
                Reset links expire after <strong style={{ color: GOLD }}>15 minutes</strong> for your security.
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ position: "relative", zIndex: 1, p: { md: 5, lg: 7 }, pt: 0 }}>
            <Box sx={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)`, mb: 3 }} />
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>
              © 2025 MedClinic Pro. All rights reserved.
            </Typography>
          </Box>
        </Box>

        {/* ── RIGHT PANEL ── */}
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
          }}
        >
          {/* Mobile logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 5, cursor: "pointer" }}
          >
            <LocalHospitalIcon sx={{ color: GOLD, fontSize: 26 }} />
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_DARK }}>
              MedClinic <span style={{ color: GOLD }}>Pro</span>
            </Typography>
          </Box>

          <Box sx={{ width: "100%", maxWidth: 420 }}>
            {/* Heading */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 56, height: 56, borderRadius: 3,
                  background: `linear-gradient(135deg, ${GOLD_LIGHT}, #fdf3d0)`,
                  border: `1.5px solid ${GOLD}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  mb: 2.5, animation: "floatY 4s ease-in-out infinite",
                  boxShadow: `0 8px 24px ${GOLD}25`,
                }}
              >
                <MailOutlineIcon sx={{ color: GOLD, fontSize: 26 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", mb: 0.5 }}>
                Forgot password?
              </Typography>
              <Typography sx={{ color: TEXT_MID, fontSize: "0.92rem" }}>
                Enter your email and we'll send you a reset link.
              </Typography>
            </Box>

            {/* Success state */}
            {sent ? (
              <Box
                sx={{
                  textAlign: "center", py: 4,
                  animation: "successPop 0.5s ease both",
                }}
              >
                <Box
                  sx={{
                    width: 72, height: 72, borderRadius: "50%", mx: "auto", mb: 3,
                    background: `linear-gradient(135deg, ${GOLD_LIGHT}, #fdf3d0)`,
                    border: `2px solid ${GOLD}50`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 32px ${GOLD}30`,
                  }}
                >
                  <CheckCircleIcon sx={{ color: GOLD, fontSize: 36 }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color={TEXT_DARK} mb={1}>
                  Check your inbox!
                </Typography>
                <Typography fontSize="0.9rem" color={TEXT_MID} lineHeight={1.7} mb={3}>
                  {message}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 4, color: TEXT_MID }}>
                  <AccessTimeIcon sx={{ fontSize: 16, color: GOLD }} />
                  <Typography fontSize="0.8rem">Reset link expires in 15 minutes</Typography>
                </Box>
                <Button
                  fullWidth
                  onClick={() => { setSent(false); setMessage(""); }}
                  sx={{
                    py: 1.4, borderRadius: 50, fontWeight: 600, fontSize: "0.92rem",
                    textTransform: "none", color: GOLD_DARK,
                    border: `1.5px solid ${GOLD}55`, bgcolor: GOLD_BG,
                    "&:hover": { bgcolor: GOLD_LIGHT, borderColor: GOLD },
                    transition: "all 0.25s",
                  }}
                >
                  Send again
                </Button>
              </Box>
            ) : (
              <>
                {/* Error alert */}
                {message && messageType === "error" && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2.5, borderRadius: 2, border: "1px solid rgba(211,47,47,0.2)" }}
                  >
                    {message}
                  </Alert>
                )}

                {/* Form */}
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  <TextField
                    className="gold-input"
                    fullWidth
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon sx={{ color: GOLD, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#fafafa" } }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      py: 1.5, borderRadius: 50, fontWeight: 700, fontSize: "1rem",
                      textTransform: "none",
                      background: loading ? `${GOLD}88` : `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                      color: "white",
                      boxShadow: `0 6px 24px ${GOLD}40`,
                      transition: "all 0.28s",
                      "&:hover:not(:disabled)": {
                        background: GOLD_DARK,
                        transform: "translateY(-2px)",
                        boxShadow: `0 10px 32px ${GOLD}55`,
                      },
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <CircularProgress size={18} sx={{ color: "rgba(255,255,255,0.8)" }} />
                        <span>Sending…</span>
                      </Box>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>

                  <Divider sx={{ borderColor: BORDER_CLR }} />

                  <Button
                    fullWidth
                    startIcon={<ArrowBackIcon fontSize="small" />}
                    onClick={() => navigate("/login")}
                    sx={{
                      py: 1.3, borderRadius: 50, fontWeight: 600, fontSize: "0.9rem",
                      textTransform: "none", color: TEXT_MID,
                      border: `1.5px solid rgba(74,74,106,0.2)`,
                      "&:hover": { bgcolor: "#f4f4f8", borderColor: TEXT_MID },
                      transition: "all 0.22s",
                    }}
                  >
                    Back to Sign In
                  </Button>
                </Box>

                <Typography
                  sx={{ mt: 4, textAlign: "center", color: "rgba(74,74,106,0.45)", fontSize: "0.73rem" }}
                >
                  Didn't receive it? Check your spam folder or{" "}
                  <Link href="#" sx={{ color: GOLD, textDecoration: "none", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}>
                    contact support
                  </Link>
                  .
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPassword;