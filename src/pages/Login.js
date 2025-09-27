import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Avatar, Button, TextField, Box, Typography, Container, Alert,
  CircularProgress, IconButton, InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Validation schema
const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

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
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      setServerError("");
      setSuccessMessage("");
      await login(data);
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/", { replace: true }), 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      setServerError(errorMessage);
    }
  };

  if (isAuthenticated === true) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Already logged in. Redirecting...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex", flexDirection: "column", alignItems: "center", p: 4,
          borderRadius: 2, boxShadow: "0px 4px 20px rgba(0,0,0,0.08)", backgroundColor: "white",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Welcome Back</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1, width: "100%" }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <TextField
            margin="normal" fullWidth label="Email Address" {...register("email")}
            error={!!errors.email} helperText={errors.email?.message} disabled={isSubmitting}
          />
          <TextField
            margin="normal" fullWidth label="Password"
            type={showPassword ? "text" : "password"} {...register("password")}
            error={!!errors.password} helperText={errors.password?.message} disabled={isSubmitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
            {isSubmitting ? <CircularProgress size={20} /> : "Sign In"}
          </Button>
        </Box>
      </Box>
    </Container>
  </Box>
  );
}
