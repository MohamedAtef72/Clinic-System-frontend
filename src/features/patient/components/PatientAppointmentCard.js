import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Button, Box, Divider } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { FaStethoscope, FaGlobe } from "react-icons/fa";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box sx={{ color: GOLD, display: "flex", p: 0.5, bgcolor: GOLD_BG, borderRadius: 1 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" sx={{ color: TEXT_MID, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", display: "block", mb: -0.3 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_DARK }}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

export const PatientAppointmentCard = ({ appointment, onShowNotes, onRateDoctor }) => {
  const hasRated = appointment.hasRated;
  const isCompleted = appointment.appointmentStatus === 'Completed';
  // Status mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return { bg: "#dcfce7", color: "#166534" };
      case "cancelled": return { bg: "#fee2e2", color: "#991b1b" };
      case "scheduled": return { bg: "#dbf0fe", color: "#075985" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  const statusStyle = getStatusColor(appointment.appointmentStatus);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        width: "300px",
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        position: "relative",
        border: `1px solid ${GOLD}30`,
        background: "linear-gradient(to bottom, #ffffff, #fafbfc)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 30px rgba(184,151,42,0.12)`,
          borderColor: `${GOLD}50`,
        },
      }}
    >
      {/* Top Section */}
      <Box sx={{ display: "flex", flexDirection: "column", p: 3, gap: 2, flex: "0 0 auto" }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              title={`Dr. ${appointment.doctor.userName}`}
              sx={{
                fontWeight: 800,
                color: TEXT_DARK,
                fontSize: "0.95rem",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                overflowWrap: "anywhere",
              }}
            >
              {appointment.doctor.userName || "N/A"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.8, color: GOLD_DARK }}>
              <FaStethoscope size={13} />
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {appointment.doctor.specialityName || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, color: TEXT_MID }}>
              <FaGlobe size={13} />
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.82rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {appointment.doctor.country || "N/A"}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={appointment.appointmentStatus}
            size="small"
            sx={{ fontWeight: 700, fontSize: "0.7rem", height: 24, bgcolor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.color}20`, flexShrink: 0 }}
          />
        </Box>

        <Divider sx={{ borderColor: `${GOLD}15` }} />

        {/* Appointment Data - Stacked vertically due to 300px width limit */}
        <Stack spacing={1.5}>
          <InfoRow icon={<EventIcon fontSize="small" sx={{ fontSize: 16 }} />} label="Date" value={appointment.startTime ? new Date(appointment.startTime).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"} />
          <InfoRow icon={<AccessTimeIcon fontSize="small" sx={{ fontSize: 16 }} />} label="Time" value={appointment.startTime ? new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"} />
          <InfoRow icon={<AttachMoneyIcon fontSize="small" sx={{ fontSize: 16 }} />} label="Price" value={`${appointment.doctorPrice || 0} EGP`} />
        </Stack>
      </Box>

      {/* Bottom Buttons - anchored evenly at the bottom */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, px: 3, pb: 3, pt: 2, borderTop: "1px solid rgba(184,151,42,0.08)", mt: "auto" }}>
        <Button
          variant="outlined"
          onClick={() => onShowNotes(appointment.visitId)}
          disabled={!appointment.visitId || !isCompleted}
          sx={{ width: "100%", borderRadius: 50, py: 1, fontWeight: 700, borderColor: `${GOLD}50`, color: GOLD_DARK, textTransform: "none", "&:hover": { borderColor: GOLD, bgcolor: GOLD_BG } }}
        >
          Show Notes
        </Button>
        <Button
          variant="contained"
          onClick={() => onRateDoctor(appointment.doctor, appointment.id, hasRated)}
          disabled={!isCompleted}
          sx={{ width: "100%", borderRadius: 50, py: 1, fontWeight: 700, bgcolor: GOLD, color: "white", textTransform: "none", boxShadow: `0 4px 12px ${GOLD}30`, "&:hover": { bgcolor: GOLD_DARK } }}
        >
          {hasRated ? "View Rating" : "Rate Doctor"}
        </Button>
      </Box>
    </Card>
  );
};