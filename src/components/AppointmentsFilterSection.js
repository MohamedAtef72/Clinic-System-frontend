import React, { useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Card, Typography, Divider, IconButton, Drawer, useTheme, useMediaQuery } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { getStatusStyle } from "./GetStatus";

import { GOLD, GOLD_DARK } from "../theme/tokens";
const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "Schedule", label: "Scheduled" },
  { value: "CheckedIn", label: "Checked In" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function AppointmentsFilterSection({ status, onStatusChange, forceCard = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filterContent = (
    <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid rgba(184,151,42,0.15)`, bgcolor: "#fff", p: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.03)" }}>
      {/* Icon + Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2, flexShrink: 0,
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 10px ${GOLD}30`
        }}>
          <FilterListIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a1a2e", fontSize: "1rem" }}>
          Filter by Status
        </Typography>
      </Box>

      <Divider sx={{ mb: 3, borderColor: `rgba(184,151,42,0.1)` }} />

      {/* Dropdown */}
      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel sx={{ color: "#4a4a6a", fontWeight: 500 }}>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={(e) => {
            onStatusChange(e.target.value);
            setMobileOpen(false);
          }}
          sx={{
            borderRadius: 3,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GOLD, borderWidth: "2px" },
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.value ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 10, height: 10, borderRadius: "50%",
                      bgcolor: getStatusStyle(opt.value).color,
                      flexShrink: 0,
                      boxShadow: `0 0 0 2px ${getStatusStyle(opt.value).bgcolor}`
                    }}
                  />
                  <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>{opt.label}</Typography>
                </Box>
              ) : (
                <Typography sx={{ fontStyle: "italic", color: "#888", fontSize: "0.9rem" }}>{opt.label}</Typography>
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Card>
  );

  if (isMobile && !forceCard) {
    return (
      <>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: 'white',
            borderRadius: 3, width: 48, height: 48,
            "&:hover": { background: GOLD_DARK }
          }}
        >
          <FilterListIcon size={18} />
        </IconButton>

        <Drawer
          anchor="bottom"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { borderTopLeftRadius: 20, borderTopRightRadius: 20, bgcolor: "#f9f8f5", p: 2 } }}
        >
          <Box sx={{ pt: 1, pb: 4 }}>
            {filterContent}
          </Box>
        </Drawer>
      </>
    );
  }

  return filterContent;
}
