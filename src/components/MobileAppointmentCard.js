import React from "react";
import {
  Card, CardContent, Typography, Stack, Grid, Box,
  IconButton, Avatar, Menu, MenuItem,
} from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { getStatusStyle } from "./GetStatus";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../theme/tokens";
/* ── Tokens ── */
/* ── Info row ── */
const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
    <Box sx={{
      width: 30, height: 30, borderRadius: 1.5, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      bgcolor: GOLD_BG, border: `1px solid ${GOLD}25`,
    }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: "0.65rem", color: TEXT_MID, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: TEXT_DARK }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

/* ── Action definitions ── */
const ALL_ACTIONS = (status) => {
  const d = (vals) => vals.includes(status);
  return [
    { label: "Check-In",  action: "CheckedIn", disabled: d(["CheckedIn","Completed"]) },
    { label: "Complete",  action: "Completed",  disabled: d(["Completed","Cancelled","NoShow"]) },
    { label: "Cancel",    action: "Cancelled",  disabled: d(["Cancelled","Completed"]) },
    { label: "No-Show",   action: "NoShow",     disabled: d(["NoShow","Completed"]) },
  ].filter((a) => !a.disabled);
};

/* ── Card ── */
export const AppointmentCard = ({ appointment, onMenuOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const statusStyle = getStatusStyle(appointment.appointmentStatus);
  const menuActions = ALL_ACTIONS(appointment.appointmentStatus);

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(184,151,42,0.15)",
          bgcolor: "#fff",
          transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 16px 48px rgba(184,151,42,0.14)`,
            borderColor: `${GOLD}50`,
          },
        }}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Stack spacing={2}>
            {/* ── Header row ── */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box
                sx={{
                  px: 1.5, py: 0.4, borderRadius: 50,
                  fontSize: "0.72rem", fontWeight: 700,
                  display: "inline-flex",
                  ...statusStyle,
                }}
              >
                {appointment.appointmentStatus}
              </Box>
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ color: TEXT_MID, "&:hover": { bgcolor: GOLD_BG, color: GOLD } }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* ── Doctor & Patient ── */}
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: GOLD_BG, color: GOLD_DARK, border: `1.5px solid ${GOLD}40`, fontSize: "0.85rem", fontWeight: 700 }}>
                    {appointment.doctorName?.[0]?.toUpperCase() || "D"}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: "0.65rem", color: TEXT_MID, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Doctor</Typography>
                    <Typography sx={{ fontSize: "0.87rem", fontWeight: 700, color: GOLD_DARK }}>Dr. {appointment.doctorName}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "#f0f0f8", color: TEXT_MID, fontSize: "0.85rem", fontWeight: 700 }}>
                    {appointment.patientName?.[0]?.toUpperCase() || "P"}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: "0.65rem", color: TEXT_MID, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Patient</Typography>
                    <Typography sx={{ fontSize: "0.87rem", fontWeight: 600, color: TEXT_DARK }}>{appointment.patientName}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Gold divider */}
            <Box sx={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}30, transparent)` }} />

            {/* ── Details ── */}
            <Stack spacing={1.5}>
              <InfoRow
                icon={<EventIcon sx={{ color: GOLD, fontSize: 16 }} />}
                label="Date"
                value={appointment.startTime ? new Date(appointment.startTime).toLocaleDateString() : "N/A"}
              />
              <InfoRow
                icon={<AccessTimeIcon sx={{ color: GOLD, fontSize: 16 }} />}
                label="Time"
                value={
                  appointment.startTime && appointment.endTime
                    ? `${new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${new Date(appointment.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : "N/A"
                }
              />
              <InfoRow
                icon={<LocalAtmIcon sx={{ color: "#22c55e", fontSize: 16 }} />}
                label="Price"
                value={`${appointment.doctorPrice} EGP`}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            border: `1px solid ${GOLD}22`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            minWidth: 150,
          },
        }}
      >
        {menuActions.length === 0 ? (
          <MenuItem disabled sx={{ fontSize: "0.82rem" }}>No actions available</MenuItem>
        ) : (
          menuActions.map((a) => (
            <MenuItem
              key={a.action}
              onClick={() => {
                onMenuOpen(null, appointment, a.action);
                setAnchorEl(null);
              }}
              sx={{
                fontSize: "0.85rem", fontWeight: 500,
                mx: 0.5, borderRadius: 1.5,
                "&:hover": { bgcolor: GOLD_BG, color: GOLD_DARK },
              }}
            >
              {a.label}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};