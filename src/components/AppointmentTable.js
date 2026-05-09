import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Box, Stack, Button, Menu, MenuItem, IconButton, Typography, Avatar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getStatusStyle } from "./GetStatus";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../theme/tokens";
/* ── Tokens ── */
/* ── Action colour map ── */
const ACTION_STYLES = {
  CheckedIn:  { bgcolor: "#22c55e", hover: "#16a34a" },
  Completed:  { bgcolor: "#3b82f6", hover: "#2563eb" },
  Cancelled:  { bgcolor: "#ef4444", hover: "#dc2626" },
};

/* ── Per-appointment action menu ── */
const TableActions = ({ appointment, onAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const allActions = {
    checkIn:  { label: "Check-In",  action: "CheckedIn",  disabled: ["CheckedIn","Completed"].includes(appointment.appointmentStatus) },
    cancel:   { label: "Cancel",    action: "Cancelled",  disabled: ["Cancelled","Completed"].includes(appointment.appointmentStatus) },
    complete: { label: "Complete",  action: "Completed",  disabled: ["Completed","Cancelled"].includes(appointment.appointmentStatus) },
  };

  let primary = null;
  let secondary = [];

  if (appointment.appointmentStatus === "CheckedIn") {
    primary = allActions.complete;
    secondary = [allActions.cancel];
  } else {
    secondary = Object.values(allActions).filter((a) => !a.disabled);
  }

  const style = primary ? ACTION_STYLES[primary.action] : null;

  return (
    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
      {primary && (
        <Button
          size="small"
          onClick={() => { onAction(appointment, primary.action); }}
          disabled={primary.disabled}
          sx={{
            borderRadius: 50, px: 1.8, py: 0.4,
            fontSize: "0.75rem", fontWeight: 700,
            textTransform: "none",
            bgcolor: style?.bgcolor,
            color: "white",
            boxShadow: "none",
            "&:hover": { bgcolor: style?.hover, transform: "translateY(-1px)" },
            transition: "all 0.2s",
          }}
        >
          {primary.label}
        </Button>
      )}
      {secondary.length > 0 && (
        <>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              color: TEXT_MID,
              "&:hover": { bgcolor: GOLD_BG, color: GOLD },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                borderRadius: 2.5,
                border: `1px solid ${GOLD}22`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                minWidth: 140,
              },
            }}
          >
            {secondary.map((btn) => (
              <MenuItem
                key={btn.action}
                disabled={btn.disabled}
                onClick={() => { onAction(appointment, btn.action); setAnchorEl(null); }}
                sx={{
                  fontSize: "0.85rem", fontWeight: 500,
                  mx: 0.5, borderRadius: 1.5,
                  "&:hover": { bgcolor: GOLD_BG, color: GOLD_DARK },
                }}
              >
                {btn.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Stack>
  );
};

/* ── Main table ── */
export const AppointmentsTable = ({ appointments, onAction }) => {
  const COL_STYLE = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: TEXT_MID,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    py: 1.8, px: 2,
    borderBottom: `2px solid ${GOLD}30`,
    bgcolor: GOLD_BG,
    whiteSpace: "nowrap",
  };

  return (
    <TableContainer
      sx={{
        borderRadius: 3,
        border: `1px solid rgba(184,151,42,0.15)`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 900, fontFamily: "'Inter', sans-serif" }}>
        <TableHead>
          <TableRow>
            {["Doctor", "Patient", "Date", "Time", "Price", "Status", "Actions"].map((h, i) => (
              <TableCell key={h} sx={{ ...COL_STYLE, textAlign: i === 6 ? "center" : "left" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {appointments.map((a, idx) => {
            const statusStyle = getStatusStyle(a.appointmentStatus);
            return (
              <TableRow
                key={a.id}
                sx={{
                  bgcolor: idx % 2 === 0 ? "#fff" : "#fafaf7",
                  "&:hover": { bgcolor: GOLD_BG },
                  "&:last-child td": { border: 0 },
                  transition: "background 0.18s",
                }}
              >
                {/* Doctor */}
                <TableCell sx={{ px: 2, py: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 30, height: 30, fontSize: "0.7rem", fontWeight: 700,
                        bgcolor: GOLD_BG, color: GOLD_DARK,
                        border: `1px solid ${GOLD}40`,
                      }}
                    >
                      {a.doctorName?.[0]?.toUpperCase() || "D"}
                    </Avatar>
                    <Typography sx={{ fontSize: "0.87rem", fontWeight: 600, color: TEXT_DARK }}>
                      Dr. {a.doctorName}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Patient */}
                <TableCell sx={{ px: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: "0.68rem", bgcolor: "#f0f0f8", color: TEXT_MID }}>
                      {a.patientName?.[0]?.toUpperCase() || "P"}
                    </Avatar>
                    <Typography sx={{ fontSize: "0.87rem", color: TEXT_DARK }}>{a.patientName}</Typography>
                  </Box>
                </TableCell>

                {/* Date */}
                <TableCell sx={{ px: 2, fontSize: "0.85rem", color: TEXT_MID }}>
                  {a.startTime ? new Date(a.startTime).toLocaleDateString() : "N/A"}
                </TableCell>

                {/* Time */}
                <TableCell sx={{ px: 2, fontSize: "0.85rem", color: TEXT_MID }}>
                  {a.startTime
                    ? new Date(a.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "N/A"}
                </TableCell>

                {/* Price */}
                <TableCell sx={{ px: 2 }}>
                  <Box
                    sx={{
                      display: "inline-flex", alignItems: "center",
                      bgcolor: "#f0fdf4", color: "#166534",
                      border: "1px solid #bbf7d0",
                      borderRadius: 50, px: 1.2, py: 0.3,
                      fontSize: "0.8rem", fontWeight: 700,
                    }}
                  >
                    {a.doctorPrice} EGP
                  </Box>
                </TableCell>

                {/* Status */}
                <TableCell sx={{ px: 2 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 1.5, py: 0.35,
                      borderRadius: 50,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      ...statusStyle,
                    }}
                  >
                    {a.appointmentStatus}
                  </Box>
                </TableCell>

                {/* Actions */}
                <TableCell align="center" sx={{ px: 2 }}>
                  <TableActions appointment={a} onAction={onAction} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};