import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, InputAdornment } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { GOLD, GOLD_BG, GOLD_DARK } from "../theme/tokens";
export default function AvailabilityForm({ onSubmit }) {
  const [form, setForm]   = useState({ startTime: "", endTime: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startTime || !form.endTime) {
      setError("Please select both start and end time.");
      return;
    }
    if (form.startTime >= form.endTime) {
      setError("End time must be after start time.");
      return;
    }
    onSubmit(form);
    setForm({ startTime: "", endTime: "" });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2, p: 3,
        borderRadius: 3,
        border: "1px solid rgba(184,151,42,0.2)",
        bgcolor: GOLD_BG,
        boxShadow: "0 4px 20px rgba(184,151,42,0.08)",
      }}
    >
      <Typography
        sx={{
          fontWeight: 700, fontSize: "0.8rem",
          color: GOLD, textTransform: "uppercase", letterSpacing: "1px",
          mb: 2,
        }}
      >
        Add Time Slot
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          name="startTime"
          label="Start Time"
          type="time"
          value={form.startTime}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTimeIcon sx={{ color: GOLD, fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5, bgcolor: "#fff",
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: GOLD },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GOLD, borderWidth: 2 },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: GOLD },
          }}
        />
        <TextField
          name="endTime"
          label="End Time"
          type="time"
          value={form.endTime}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTimeIcon sx={{ color: GOLD, fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5, bgcolor: "#fff",
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: GOLD },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GOLD, borderWidth: 2 },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: GOLD },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2, border: "1px solid rgba(211,47,47,0.2)" }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          mt: 2.5, py: 1.3,
          borderRadius: 50,
          fontWeight: 700,
          fontSize: "0.9rem",
          textTransform: "none",
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
          color: "white",
          boxShadow: `0 4px 16px ${GOLD}40`,
          "&:hover": {
            background: GOLD_DARK,
            transform: "translateY(-1px)",
            boxShadow: `0 8px 24px ${GOLD}55`,
          },
          transition: "all 0.25s",
        }}
      >
        Add Time Slot
      </Button>
    </Box>
  );
}
