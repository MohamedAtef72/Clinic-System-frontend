import React from "react";
import {
  Card, CardContent, Typography, Box, Avatar, Button, Divider,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { getStatusStyle } from "../../../components/GetStatus";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";

/* ── Status config matching dashboard style ── */
const STATUS_MAP = {
  completed: { bg: "#dcfce7", color: "#166534" },
  schedule: { bg: "#fef9c3", color: "#854d0e" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};
const getStatusCfg = (s) =>
  STATUS_MAP[s?.toLowerCase()] || { bg: "#f3f4f6", color: "#374151" };

/* ─────────────────────────────────────────────────────────────────── */
export const AppointmentReviewCard = ({ appointment, onShowRate, onShowNotes, onMenuOpen }) => {
  const isCompleted = appointment.appointmentStatus === "Completed";
  const statusCfg = getStatusCfg(appointment.appointmentStatus);

  const startDate = appointment.startTime
    ? new Date(appointment.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";
  const startTime = appointment.startTime
    ? new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "N/A";

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 4,
        border: "1px solid rgba(184,151,42,0.12)",
        bgcolor: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 14px 36px rgba(184,151,42,0.13)`,
          borderColor: `${GOLD}40`,
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 }, display: "flex", flexDirection: "column", flexGrow: 1, gap: 0 }}>

        {/* ── Row 1: Status badge + Doctor avatar ── */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box
            sx={{
              px: 1.5, py: 0.45, borderRadius: 50,
              bgcolor: statusCfg.bg,
            }}
          >
            <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: statusCfg.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {appointment.appointmentStatus || "Unknown"}
            </Typography>
          </Box>
        </Box>

        {/* ── Row 2: Patient name + role ── */}
        <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: TEXT_DARK, mb: 0.3 }}>
          {appointment.patientName || "Patient"}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: TEXT_MID, mb: 2 }}>
          Patient
        </Typography>

        <Divider sx={{ borderColor: "rgba(184,151,42,0.1)", mb: 2 }} />

        {/* ── Row 3: Doctor name + Time/Date columns ── */}
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 2.5 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.68rem", color: TEXT_MID, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.4 }}>
              Doctor
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: GOLD_DARK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Dr. {appointment.doctorName || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography sx={{ fontSize: "0.68rem", color: TEXT_MID, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.4 }}>
              Time / Date
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: TEXT_DARK, lineHeight: 1.3 }}>
              {startTime}
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: TEXT_MID, fontWeight: 500 }}>
              {startDate}
            </Typography>
          </Box>
        </Box>

        {/* ── Speciality row ── */}
        {appointment.specialityName && (
          <Box
            sx={{
              display: "inline-flex", alignItems: "center", gap: 0.8,
              px: 1.5, py: 0.5, borderRadius: 50, mb: 2.5,
              bgcolor: GOLD_BG, border: `1px solid ${GOLD}20`,
            }}
          >
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: GOLD_DARK }}>
              {appointment.specialityName}
            </Typography>
          </Box>
        )}

        {/* ── Actions (pushed to bottom) ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: "auto" }}>
          {/* Notes + Status buttons */}
          {(onShowNotes || onMenuOpen) && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {onShowNotes && (
                <Button
                  fullWidth variant="outlined" size="small"
                  onClick={() => onShowNotes(appointment)}
                  sx={{
                    py: 0.9, borderRadius: 50, fontWeight: 700, fontSize: "0.78rem",
                    textTransform: "none", color: GOLD_DARK, borderColor: `${GOLD}50`,
                    "&:hover": { borderColor: GOLD, bgcolor: GOLD_BG },
                  }}
                >
                  View Notes
                </Button>
              )}
              {onMenuOpen && (
                <Button
                  fullWidth variant="outlined" size="small"
                  onClick={(e) => onMenuOpen(e, appointment)}
                  sx={{
                    py: 0.9, borderRadius: 50, fontWeight: 700, fontSize: "0.78rem",
                    textTransform: "none", color: TEXT_MID, borderColor: "rgba(74,74,106,0.25)",
                    "&:hover": { borderColor: TEXT_DARK, bgcolor: "#f5f5f8" },
                  }}
                >
                  Status
                </Button>
              )}
            </Box>
          )}

          {/* Rating */}
          {onShowRate && (
            isCompleted ? (
              <Button
                fullWidth
                startIcon={<StarRoundedIcon sx={{ fontSize: "1rem !important" }} />}
                onClick={() => onShowRate(appointment.id)}
                sx={{
                  py: 1.1, borderRadius: 50, fontWeight: 700, fontSize: "0.84rem",
                  textTransform: "none",
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                  color: "white",
                  boxShadow: `0 4px 14px ${GOLD}35`,
                  "&:hover": { background: GOLD_DARK, transform: "translateY(-1px)", boxShadow: `0 6px 20px ${GOLD}50` },
                  transition: "all 0.22s",
                }}
              >
                Show Rating
              </Button>
            ) : (
              <Box
                sx={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                  py: 1.1, borderRadius: 50,
                  bgcolor: "rgba(74,74,106,0.04)",
                  border: "1.5px dashed rgba(74,74,106,0.14)",
                  color: "rgba(74,74,106,0.38)",
                  fontSize: "0.8rem", fontWeight: 600,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 15 }} />
                Rating Locked
              </Box>
            )
          )}
        </Box>

      </CardContent>
    </Card>
  );
};