import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  Link,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { resetPassword } from "../../../services/authService";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  backgroundColor: "#ffffff",
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(3),
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

const StyledIconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(102, 126, 234, 0.1)",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ErrorBox = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Get query parameters when component loads
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const tokenFromUrl = searchParams.get("token");
    if (emailFromUrl && tokenFromUrl) {
      setEmail(emailFromUrl);
      setToken(tokenFromUrl);
    } else {
      setMessage("Invalid password reset link.");
      setMessageType("error");
    }
  }, [searchParams]);

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword, confirmPassword]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      setMessageType("error");
      return;
    }

    if (!passwordsMatch) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      await resetPassword({ email, token, newPassword });

      setMessage("Password reset successfully! Redirecting to login...");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      console.error("Error in Reset Password:", error);

      if (error.response?.data?.Message) {
        setMessage(error.response.data.Message);
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.message) {
        setMessage(error.message);
      } else {
        setMessage(
          "An error occurred while resetting your password. Please try again."
        );
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper elevation={6}>
        {/* Header Section */}
        <HeaderBox>
          <IconBox>
            <StyledIconWrapper>
              <LockResetIcon sx={{ fontSize: 40, color: "#667eea" }} />
            </StyledIconWrapper>
          </IconBox>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#2d3748",
              marginBottom: 1,
            }}
          >
            Reset Your Password
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#718096",
              fontSize: "0.95rem",
            }}
          >
            Create a new strong password to secure your account.
          </Typography>
        </HeaderBox>

        {/* If email/token missing */}
        {!email || !token ? (
          <Alert
            icon={<ErrorIcon fontSize="inherit" />}
            severity="error"
            sx={{ borderRadius: 1 }}
          >
            <Typography variant="body2">
              Invalid or expired password reset link. Please request a new one.
            </Typography>
            <Link
              href="/forgot-password"
              sx={{
                display: "block",
                marginTop: 1,
                color: "#667eea",
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Request New Reset Link
            </Link>
          </Alert>
        ) : (
          <>
            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* New Password Input */}
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
                variant="outlined"
                margin="normal"
                helperText="Password must be at least 8 characters long"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#cbd5e0" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />

              {/* Confirm Password Input */}
              <TextField
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                variant="outlined"
                margin="normal"
                error={!passwordsMatch && confirmPassword.length > 0}
                helperText={
                  !passwordsMatch && confirmPassword.length > 0
                    ? "Passwords do not match"
                    : ""
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#cbd5e0" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleConfirmPasswordVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginBottom: 3,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !passwordsMatch || !newPassword}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "12px 24px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 1,
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    opacity: 0.7,
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{ marginRight: 1, color: "white" }}
                    />
                    Resetting...
                  </>
                ) : (
                  "Confirm & Reset Password"
                )}
              </Button>
            </Box>
          </>
        )}

        {/* Alert Messages */}
        {message && (
          <ErrorBox
            icon={
              messageType === "success" ? (
                <CheckCircleIcon fontSize="inherit" />
              ) : (
                <ErrorIcon fontSize="inherit" />
              )
            }
            severity={messageType === "success" ? "success" : "error"}
          >
            {message}
          </ErrorBox>
        )}

        {/* Divider */}
        <Box
          sx={{
            marginTop: 3,
            marginBottom: 2,
            borderTop: "1px solid #e2e8f0",
          }}
        />

        {/* Footer Links */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#718096" }}>
            <Link
              href="/login"
              sx={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                  color: "#764ba2",
                },
              }}
            >
              Back to Sign In
            </Link>
          </Typography>
        </Box>

        {/* Security Note */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            marginTop: 2,
            textAlign: "center",
            color: "#a0aec0",
          }}
        >
          🔒 Your password is secure and encrypted. Never share it with anyone.
        </Typography>
      </StyledPaper>
    </StyledContainer>
  );
};

export default ResetPassword;