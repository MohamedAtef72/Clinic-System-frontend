import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert, CircularProgress, InputAdornment, Link, Divider, IconButton, LinearProgress } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import KeyIcon from "@mui/icons-material/Key";
import { resetPassword } from '../../../services/authService';

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
const BORDER_CLR = "rgba(184,151,42,0.25)";

/* ── Password strength calculator ── */
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score: 20, label: "Weak", color: "#ef4444" };
  if (score === 2) return { score: 40, label: "Fair", color: "#f59e0b" };
  if (score === 3) return { score: 60, label: "Good", color: GOLD };
  if (score === 4) return { score: 80, label: "Strong", color: "#22c55e" };
  return { score: 100, label: "Very Strong", color: "#16a34a" };
}

const SECURITY_TIPS = [
  "Use at least 8 characters",
  "Mix uppercase, numbers & symbols",
  "Avoid reusing old passwords",
];

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [success, setSuccess] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const tokenFromUrl = searchParams.get("token");
    if (emailFromUrl && tokenFromUrl) {
      setEmail(emailFromUrl);
      setToken(tokenFromUrl);
    } else {
      setInvalidLink(true);
      setMessage("Invalid or expired password reset link. Please request a new one.");
      setMessageType("error");
    }
  }, [searchParams]);

  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }
    if (!passwordsMatch) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    setMessage("");
    setMessageType("");
    try {
      await resetPassword({ email, token, newPassword });
      setSuccess(true);
      setMessage("Password reset successfully! Redirecting to login…");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      const msg =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        error.message ||
        "An error occurred while resetting your password. Please try again.";
      setMessage(msg);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(newPassword);

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
              Create a New
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
              Secure Password.
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: 340, mb: 6 }}>
              Choose a strong, unique password to protect your healthcare
              records and personal data.
            </Typography>

            {/* Security tips */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {SECURITY_TIPS.map((tip, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <KeyIcon sx={{ color: GOLD, fontSize: 16, flexShrink: 0 }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                    {tip}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Security badge */}
            <Box
              sx={{
                display: "flex", alignItems: "center", gap: 1.2, mt: 6,
                p: 2, borderRadius: 2, bgcolor: `${GOLD}12`, border: `1px solid ${GOLD}25`,
              }}
            >
              <ShieldOutlinedIcon sx={{ color: GOLD, fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", lineHeight: 1.5 }}>
                Your new password is <strong style={{ color: GOLD }}>256-bit encrypted</strong> and stored securely.
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
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            px: { xs: 3, sm: 6, lg: 10 }, py: 6,
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

            {/* ── Success state ── */}
            {success ? (
              <Box sx={{ textAlign: "center", py: 4, animation: "successPop 0.5s ease both" }}>
                <Box
                  sx={{
                    width: 80, height: 80, borderRadius: "50%", mx: "auto", mb: 3,
                    background: `linear-gradient(135deg, ${GOLD_LIGHT}, #fdf3d0)`,
                    border: `2px solid ${GOLD}50`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 32px ${GOLD}30`,
                  }}
                >
                  <CheckCircleIcon sx={{ color: GOLD, fontSize: 40 }} />
                </Box>
                <Typography variant="h5" fontWeight={800} color={TEXT_DARK} mb={1}>
                  Password Reset!
                </Typography>
                <Typography fontSize="0.9rem" color={TEXT_MID} lineHeight={1.7} mb={3}>
                  {message}
                </Typography>
                <CircularProgress size={20} sx={{ color: GOLD }} />
              </Box>
            ) : (
              <>
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
                    <LockResetIcon sx={{ color: GOLD, fontSize: 26 }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", mb: 0.5 }}>
                    Reset password
                  </Typography>
                  <Typography sx={{ color: TEXT_MID, fontSize: "0.92rem" }}>
                    Create a new strong password for your account.
                  </Typography>
                </Box>

                {/* Invalid link alert */}
                {invalidLink && (
                  <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2, border: "1px solid rgba(211,47,47,0.2)" }}
                    action={
                      <Link
                        href="/forgot-password"
                        sx={{ color: GOLD, fontWeight: 600, fontSize: "0.8rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                      >
                        Request new link
                      </Link>
                    }
                  >
                    Invalid or expired reset link.
                  </Alert>
                )}

                {/* Error / regular alert */}
                {message && !success && !invalidLink && (
                  <Alert
                    severity={messageType === "success" ? "success" : "error"}
                    sx={{
                      mb: 2.5, borderRadius: 2,
                      border: messageType === "error" ? "1px solid rgba(211,47,47,0.2)" : `1px solid ${GOLD}40`,
                      ...(messageType === "success" && { bgcolor: GOLD_BG, color: GOLD_DARK, "& .MuiAlert-icon": { color: GOLD } }),
                    }}
                  >
                    {message}
                  </Alert>
                )}

                {/* Form */}
                {!invalidLink && (
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                  >
                    {/* New password */}
                    <Box>
                      <TextField
                        className="gold-input"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="New Password"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: GOLD, fontSize: 20 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end" size="small" sx={{ color: TEXT_MID }}
                              >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#fafafa" } }}
                      />

                      {/* Strength bar */}
                      {newPassword.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={strength.score}
                            sx={{
                              height: 4, borderRadius: 2,
                              bgcolor: "rgba(0,0,0,0.06)",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: strength.color,
                                borderRadius: 2,
                                transition: "all 0.4s ease",
                              },
                            }}
                          />
                          <Typography
                            sx={{ fontSize: "0.72rem", mt: 0.5, color: strength.color, fontWeight: 600 }}
                          >
                            {strength.label}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Confirm password */}
                    <TextField
                      className="gold-input"
                      fullWidth
                      type={showConfirm ? "text" : "password"}
                      label="Confirm Password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                      error={!passwordsMatch && confirmPassword.length > 0}
                      helperText={
                        !passwordsMatch && confirmPassword.length > 0
                          ? "Passwords do not match"
                          : confirmPassword.length > 0 && passwordsMatch
                            ? "✓ Passwords match"
                            : ""
                      }
                      FormHelperTextProps={{
                        sx: {
                          color:
                            !passwordsMatch && confirmPassword.length > 0
                              ? "error.main"
                              : GOLD,
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon
                              sx={{
                                fontSize: 20,
                                color:
                                  !passwordsMatch && confirmPassword.length > 0
                                    ? "error.main"
                                    : GOLD,
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirm(!showConfirm)}
                              edge="end" size="small" sx={{ color: TEXT_MID }}
                            >
                              {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#fafafa" } }}
                    />

                    {/* Submit */}
                    <Button
                      type="submit"
                      fullWidth
                      disabled={loading || !passwordsMatch || !newPassword || !confirmPassword}
                      sx={{
                        mt: 0.5, py: 1.5, borderRadius: 50, fontWeight: 700, fontSize: "1rem",
                        textTransform: "none",
                        background:
                          loading || !passwordsMatch || !newPassword || !confirmPassword
                            ? `${GOLD}66`
                            : `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
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
                          <span>Resetting…</span>
                        </Box>
                      ) : (
                        "Confirm & Reset Password"
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
                )}

                <Typography
                  sx={{ mt: 4, textAlign: "center", color: "rgba(74,74,106,0.45)", fontSize: "0.72rem" }}
                >
                  🔒 Your password is encrypted and stored securely. Never share it with anyone.
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResetPassword;