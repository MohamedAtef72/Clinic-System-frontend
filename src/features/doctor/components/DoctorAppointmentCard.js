import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Button, Box, Divider } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import { getStatusStyle } from "../../../components/GetStatus";
import { FaGlobe } from "react-icons/fa";


import { GOLD, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
export const DoctorAppointmentCard = ({ appointment, onAddNotes, onUpdateVisit, onShowNotes, onShowRate }) => {
  const isVisitAddActive = appointment.appointmentStatus === "CheckedIn";
  const isVisitUpdateActive = appointment.appointmentStatus === "Completed";
  const statusStyle = getStatusStyle(appointment.appointmentStatus);
  const patientInitials = appointment.patientName !== "N/A" ? appointment.patientName.substring(0, 2).toUpperCase() : "?";

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
        border: `1px solid rgba(184,151,42,0.15)`,
        background: "linear-gradient(to bottom, #ffffff, #fafbfc)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 30px rgba(184,151,42,0.12)`,
          borderColor: `${GOLD}40`
        },
      }}
    >
      {/* Top Section */}
      <Box sx={{ display: "flex", flexDirection: "column", p: 3, gap: 1, flex: "0 0 auto" }}>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
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
              {appointment.patientName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.8, color: GOLD_DARK }}>
              <BloodtypeIcon sx={{ fontSize: 16 }} />
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {appointment.patientBloodType || "N/A"}
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
                {appointment.patientCountry || "N/A"}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={appointment.appointmentStatus}
            size="small"
            sx={{ fontWeight: 700, fontSize: "0.7rem", height: 24, backgroundColor: statusStyle.bgcolor, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, flexShrink: 0 }}
          />
        </Box>

        <Divider sx={{ borderColor: `rgba(184,151,42,0.1)` }} />

        {/* Time & Date */}
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ color: GOLD, display: "flex", p: 0.5, bgcolor: '#fdf8ec', borderRadius: 1 }}><EventIcon fontSize="small" sx={{ fontSize: 16 }} /></Box>
            <Box>
              <Typography variant="caption" sx={{ color: TEXT_MID, fontWeight: 700, textTransform: "uppercase", display: "block", mb: -0.3 }}>Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_DARK }}>{appointment.startTime ? new Date(appointment.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ color: GOLD, display: "flex", p: 0.5, bgcolor: '#fdf8ec', borderRadius: 1 }}><AccessTimeIcon fontSize="small" sx={{ fontSize: 16 }} /></Box>
            <Box>
              <Typography variant="caption" sx={{ color: TEXT_MID, fontWeight: 700, textTransform: "uppercase", display: "block", mb: -0.3 }}>Time</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_DARK }}>{appointment.startTime ? new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Bottom Buttons - anchored evenly at the bottom */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, px: 3, pb: 3, pt: 2, borderTop: "1px solid rgba(184,151,42,0.08)", mt: "auto" }}>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained" size="small"
            onClick={() => onAddNotes(appointment.visitId, appointment.id)}
            disabled={!isVisitAddActive}
            sx={{ flex: 1, borderRadius: 50, py: 1, fontWeight: 600, textTransform: "none", bgcolor: GOLD, "&:hover": { bgcolor: GOLD_DARK }, boxShadow: `0 4px 12px ${GOLD}30` }}
          >
            Add Notes
          </Button>
          <Button
            variant="contained" size="small"
            onClick={() => onUpdateVisit(appointment.visitId)}
            disabled={!isVisitUpdateActive}
            sx={{ flex: 1, borderRadius: 50, py: 1, fontWeight: 600, textTransform: "none", bgcolor: GOLD, "&:hover": { bgcolor: GOLD_DARK }, boxShadow: `0 4px 12px ${GOLD}30` }}
          >
            Update
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined" size="small"
            onClick={() => onShowNotes(appointment.visitId)}
            disabled={!appointment.visitId}
            sx={{ flex: 1, borderRadius: 50, borderColor: `${GOLD}50`, color: GOLD_DARK, fontWeight: 600, textTransform: "none", "&:hover": { bgcolor: '#fdf8ec', borderColor: GOLD } }}
          >
            Notes
          </Button>
          <Button
            variant="outlined" size="small"
            onClick={() => onShowRate(appointment.id)}
            disabled={appointment.appointmentStatus !== 'Completed'}
            sx={{ flex: 1, borderRadius: 50, borderColor: `${GOLD}50`, color: GOLD_DARK, fontWeight: 600, textTransform: "none", "&:hover": { bgcolor: '#fdf8ec', borderColor: GOLD } }}
          >
            Rating
          </Button>
        </Box>

      </Box>
    </Card>
  );
};