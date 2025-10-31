import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function AvailabilityForm({ onSubmit }) {
  const [form, setForm] = useState({ startTime: "", endTime: "" });
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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        name="startTime"
        label="Start Time"
        type="time"
        value={form.startTime}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        name="endTime"
        label="End Time"
        type="time"
        value={form.endTime}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Add Slot
      </Button>
    </Box>
  );
}
