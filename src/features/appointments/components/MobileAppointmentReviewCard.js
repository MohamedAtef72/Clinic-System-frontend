import React from "react";
import {
  Card, CardContent, Typography, Stack, Grid, Box, Button, Avatar,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { getStatusStyle } from "../../../components/GetStatus";
import { FaGlobe } from "react-icons/fa";


import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
/* ── Tokens ── */
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
      <Typography sx={{ fontSize: "0.63rem", color: TEXT_MID, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: TEXT_DARK }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export const AppointmentReviewCard = ({ appointment, onShowRate, onShowNotes, onMenuOpen }) => {
  const isCompleted = appointment.appointmentStatus === "Completed";
  const statusStyle = getStatusStyle(appointment.appointmentStatus);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        width: "300px",
        minHeight: 260,
        borderRadius: 3,
        border: "1px solid rgba(184,151,42,0.15)",
        bgcolor: "#fff",
        transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 16px 48px rgba(184,151,42,0.13)`,
          borderColor: `${GOLD}50`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2}>
          {/* Status pill */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ px: 1.5, py: 0.35, borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, display: "inline-flex", ...statusStyle }}>
              {appointment.appointmentStatus}
            </Box>
          </Box>

          {/* Doctor & Patient */}
          <Grid container spacing={3.5} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: GOLD_BG, color: GOLD_DARK, border: `1.5px solid ${GOLD}40`, fontSize: "0.85rem", fontWeight: 700 }}>
                  D
                </Avatar>
                <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.87rem", fontWeight: 700, color: GOLD_DARK, lineHeight: 1.2 }}>
                    {appointment.doctorName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.4, color: TEXT_MID }}>
                    <FaGlobe size={11} />
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.78rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {appointment.doctorCountry || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#f0f0f8", color: TEXT_MID, fontSize: "0.85rem", fontWeight: 700 }}>
                  P
                </Avatar>
                <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.87rem", fontWeight: 600, color: TEXT_DARK, lineHeight: 1.2 }}>
                    {appointment.patientName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.4, color: TEXT_MID }}>
                    <FaGlobe size={11} />
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.78rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {appointment.patientCountry || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Gold gradient divider */}
          <Box sx={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}30, transparent)` }} />

          {/* Details */}
          <Stack spacing={1.5}>
            <InfoRow
              icon={<EventIcon sx={{ color: GOLD, fontSize: 16 }} />}
              label="Date"
              value={appointment.startTime ? new Date(appointment.startTime).toLocaleDateString() : "N/A"}
            />
            <InfoRow
              icon={<AccessTimeIcon sx={{ color: GOLD, fontSize: 16 }} />}
              label="Time"
              value={appointment.startTime
                ? new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "N/A"}
            />
          </Stack>

          {/* Core Action Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {onShowNotes && (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => onShowNotes(appointment)}
                sx={{
                  py: 1, borderRadius: 50, fontWeight: 700, fontSize: "0.8rem",
                  textTransform: "none", color: GOLD_DARK, borderColor: `${GOLD}50`,
                  "&:hover": { borderColor: GOLD, bgcolor: GOLD_BG },
                }}
              >
                View Notes
              </Button>
            )}

            {onMenuOpen && (
              <Button
                fullWidth
                variant="outlined"
                onClick={(e) => onMenuOpen(e, appointment)}
                sx={{
                  py: 1, borderRadius: 50, fontWeight: 700, fontSize: "0.8rem",
                  textTransform: "none", color: TEXT_DARK, borderColor: `rgba(74,74,106,0.3)`,
                  "&:hover": { borderColor: TEXT_DARK, bgcolor: "#f0f0f8" },
                }}
              >
                Status
              </Button>
            )}
          </Box>

          {/* Rating button */}
          {onShowRate && (
            isCompleted ? (
              <Button
                fullWidth
                startIcon={<StarRoundedIcon />}
                onClick={() => onShowRate(appointment.id)}
                sx={{
                  py: 1.2, borderRadius: 50, fontWeight: 700, fontSize: "0.88rem",
                  textTransform: "none",
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                  color: "white",
                  boxShadow: `0 4px 16px ${GOLD}40`,
                  "&:hover": { background: GOLD_DARK, transform: "translateY(-2px)", boxShadow: `0 8px 24px ${GOLD}50` },
                  transition: "all 0.25s",
                }}
              >
                Show Rating
              </Button>
            ) : (
              <Box
                sx={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                  py: 1.2, borderRadius: 50,
                  bgcolor: "rgba(74,74,106,0.05)",
                  border: "1.5px dashed rgba(74,74,106,0.15)",
                  color: "rgba(74,74,106,0.4)",
                  fontSize: "0.83rem", fontWeight: 600,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 16 }} />
                Rating Locked
              </Box>
            )
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};