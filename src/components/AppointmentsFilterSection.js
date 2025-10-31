import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem,Stack } from "@mui/material";

export default function AppointmentsFilterSection({ status, onStatusChange, onApply }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Schedule">Schedule</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="CheckedIn">Checked In</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="NoShow">NoShow</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
