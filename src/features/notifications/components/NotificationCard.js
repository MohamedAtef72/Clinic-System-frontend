import React from "react";
import { Avatar, Box, Chip, Fade, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import InfoIcon from "@mui/icons-material/Info";

import { GOLD, GOLD_BG, GOLD_DARK } from "../../../theme/tokens";
const typeConfig = {
  AppointmentCancelled: { icon: <CancelIcon fontSize="small" />, color: "#ef4444", bg: "#fef2f2",            border: "#fca5a5", label: "Cancelled" },
  AppointmentBooked:    { icon: <CalendarMonthIcon fontSize="small" />, color: GOLD_DARK, bg: GOLD_BG,     border: `${GOLD}50`, label: "Booked" },
  PatientCheckedIn:     { icon: <PersonAddIcon fontSize="small" />, color: "#3b82f6", bg: "#eff6ff",         border: "#93c5fd", label: "Checked In" },
  DoctorAdded:          { icon: <MedicalServicesIcon fontSize="small" />, color: GOLD_DARK, bg: GOLD_BG,   border: `${GOLD}50`, label: "Doctor Added" },
  default:              { icon: <InfoIcon fontSize="small" />, color: "#64748b", bg: "#f8fafc",              border: "#cbd5e1", label: "Info" },
};

const getTypeConfig = (type) => typeConfig[type] ?? typeConfig.default;

export default function NotificationCard({ notification, onMarkRead }) {
  const cfg = getTypeConfig(notification.type);
  const isUnread = !notification.isRead;

  return (
    <Fade in>
      <ListItem
        alignItems="flex-start"
        sx={{
          borderRadius: 3, mb: 1.5, px: 2.5, py: 2,
          background: isUnread ? `linear-gradient(135deg, ${GOLD_BG}80, #fff)` : "#fff",
          border: "1px solid",
          borderColor: isUnread ? `${GOLD}60` : "rgba(184,151,42,0.15)",
          transition: "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
          cursor: isUnread ? "pointer" : "default",
          boxShadow: isUnread ? `0 4px 16px ${GOLD}15` : "none",
          "&:hover": {
            borderColor: isUnread ? GOLD : `${GOLD}40`,
            transform: "translateY(-2px)",
            boxShadow: `0 6px 20px rgba(184,151,42,0.15)`,
          },
        }}
        onClick={() => isUnread && onMarkRead(notification.id)}
      >
        <ListItemAvatar sx={{ minWidth: 54, mt: 0.5 }}>
          <Avatar sx={{ width: 42, height: 42, bgcolor: cfg.bg, color: cfg.color, border: `1.5px solid ${cfg.border}` }}>
            {cfg.icon}
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          disableTypography
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.8 }}>
              <Typography sx={{ fontWeight: isUnread ? 800 : 600, color: isUnread ? "#1a1a2e" : "#4a4a6a", fontSize: "0.95rem" }}>
                {notification.title}
              </Typography>
              <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }} />
              {isUnread && (
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: GOLD, flexShrink: 0, ml: "auto", boxShadow: `0 0 8px ${GOLD}90` }} />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography sx={{ color: "#4a4a6a", fontSize: "0.85rem", lineHeight: 1.6, mb: 1 }}>{notification.message}</Typography>
              <Typography sx={{ color: "rgba(74,74,106,0.5)", fontSize: "0.75rem", fontWeight: 600 }}>
                {new Date(notification.createdAt).toLocaleDateString()} · {new Date(notification.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Typography>
            </Box>
          }
        />
      </ListItem>
    </Fade>
  );
}
