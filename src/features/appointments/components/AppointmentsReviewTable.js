import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Box, Button, Typography, Avatar,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { getStatusStyle } from "../../../components/GetStatus";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
/* ── Tokens ── */
const COL_SX = {
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

export const AppointmentsReviewTable = ({ appointments, onShowRate }) => (
  <TableContainer
    sx={{
      borderRadius: 3,
      border: `1px solid rgba(184,151,42,0.15)`,
      boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      overflow: "hidden",
    }}
  >
    <Table sx={{ minWidth: 900 }}>
      <TableHead>
        <TableRow>
          {["Doctor", "Patient", "Date", "Time", "Status", "Rating"].map((h, i) => (
            <TableCell key={h} sx={{ ...COL_SX, textAlign: i === 5 ? "center" : "left" }}>
              {h}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {appointments.map((a, idx) => {
          const isCompleted = a.appointmentStatus === "Completed";
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
                  <Avatar sx={{ width: 30, height: 30, fontSize: "0.7rem", fontWeight: 700, bgcolor: GOLD_BG, color: GOLD_DARK, border: `1px solid ${GOLD}40` }}>
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
                {a.startTime ? new Date(a.startTime).toLocaleDateString() : "NfefeA"}
              </TableCell>

              {/* Time */}
              <TableCell sx={{ px: 2, fontSize: "0.85rem", color: TEXT_MID }}>
                {a.StartTime
                  ? new Date(a.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "N/A"}
              </TableCell>

              {/* Status */}
              <TableCell sx={{ px: 2 }}>
                <Box sx={{ display: "inline-flex", px: 1.5, py: 0.35, borderRadius: 50, fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap", ...statusStyle }}>
                  {a.appointmentStatus}
                </Box>
              </TableCell>

              {/* Rating button */}
              <TableCell align="center" sx={{ px: 2 }}>
                {isCompleted ? (
                  <Button
                    size="small"
                    startIcon={<StarRoundedIcon sx={{ fontSize: "16px !important" }} />}
                    onClick={() => onShowRate(a.id)}
                    sx={{
                      borderRadius: 50, px: 2, py: 0.5,
                      fontSize: "0.75rem", fontWeight: 700,
                      textTransform: "none",
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                      color: "white",
                      boxShadow: `0 3px 10px ${GOLD}40`,
                      "&:hover": { background: GOLD_DARK, transform: "translateY(-1px)" },
                      transition: "all 0.2s",
                    }}
                  >
                    Show Rating
                  </Button>
                ) : (
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: "rgba(74,74,106,0.4)", fontSize: "0.75rem" }}>
                    <LockOutlinedIcon sx={{ fontSize: 13 }} />
                    Locked
                  </Box>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);