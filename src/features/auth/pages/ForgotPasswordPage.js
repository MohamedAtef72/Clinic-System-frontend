import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { forgotPassword } from "../../../services/authService";

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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address");
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
      setEmail("");
    } catch (error) {
      console.error("Error in Forgot Password:", error);

      if (error.response?.data?.Message) {
        setMessage(error.response.data.Message);
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.message) {
        setMessage(error.message);
      } else {
        setMessage(
          "An error occurred while sending the reset request. Please try again."
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
              <MailOutlineIcon
                sx={{ fontSize: 40, color: "#667eea" }}
              />
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
            Forgot Password?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#718096",
              fontSize: "0.95rem",
            }}
          >
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </Typography>
        </HeaderBox>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Email Input */}
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon sx={{ color: "#cbd5e0" }} />
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
              "& .MuiOutlinedInput-input::placeholder": {
                color: "#a0aec0",
                opacity: 1,
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </Box>

        {/* Alert Messages */}
        {message && (
          <Alert
            icon={
              messageType === "success" ? (
                <CheckCircleIcon fontSize="inherit" />
              ) : (
                <ErrorIcon fontSize="inherit" />
              )
            }
            severity={messageType === "success" ? "success" : "error"}
            sx={{
              marginTop: 3,
              borderRadius: 1,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            {message}
          </Alert>
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
            Remember your password?{" "}
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
              Sign In
            </Link>
          </Typography>
        </Box>

        {/* Help Text */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            marginTop: 2,
            textAlign: "center",
            color: "#a0aec0",
          }}
        >
          Didn't receive the email? Check your spam folder or{" "}
          <Link
            sx={{
              color: "#667eea",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            contact support
          </Link>
        </Typography>
      </StyledPaper>
    </StyledContainer>
  );
};

export default ForgotPassword;