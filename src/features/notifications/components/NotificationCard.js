import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Fade,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import InfoIcon from "@mui/icons-material/Info";

// ─── Type config ──────────────────────────────────────────────────────────────

const typeConfig = {
  AppointmentCancelled: {
    icon: <CancelIcon fontSize="small" />,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    label: "Cancelled",
  },
  AppointmentBooked: {
    icon: <CalendarMonthIcon fontSize="small" />,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    label: "Booked",
  },
  PatientCheckedIn: {
    icon: <PersonAddIcon fontSize="small" />,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    label: "Checked In",
  },
  DoctorAdded: {
    icon: <MedicalServicesIcon fontSize="small" />,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    label: "Doctor Added",
  },
  default: {
    icon: <InfoIcon fontSize="small" />,
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
    label: "Info",
  },
};

const getTypeConfig = (type) => typeConfig[type] ?? typeConfig.default;

// ─── Date helpers ─────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationCard({ notification, onMarkRead }) {
  const cfg = getTypeConfig(notification.type);
  const isUnread = !notification.isRead;

  return (
    <Fade in>
      <ListItem
        id={`notification-${notification.id}`}
        alignItems="flex-start"
        sx={{
          borderRadius: 2,
          mb: 1,
          px: 2,
          py: 1.5,
          background: isUnread
            ? "linear-gradient(135deg, rgba(25,118,210,0.07) 0%, rgba(25,118,210,0.03) 100%)"
            : "#fafbfc",
          border: "1px solid",
          borderColor: isUnread ? "rgba(25,118,210,0.25)" : "#e2e8f0",
          transition: "all 0.2s ease",
          cursor: isUnread ? "pointer" : "default",
          "&:hover": {
            borderColor: isUnread ? "rgba(25,118,210,0.5)" : "#cbd5e1",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          },
        }}
        onClick={() => isUnread && onMarkRead(notification.id)}
      >
        {/* Avatar */}
        <ListItemAvatar sx={{ minWidth: 48, mt: 0.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: cfg.bg,
              color: cfg.color,
              border: `2px solid ${cfg.color}30`,
            }}
          >
            {cfg.icon}
          </Avatar>
        </ListItemAvatar>

        {/* Content */}
        <ListItemText
          disableTypography
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.5 }}>
              <Typography
                variant="subtitle2"
                fontWeight={isUnread ? 700 : 500}
                sx={{ color: isUnread ? "text.primary" : "text.secondary" }}
              >
                {notification.title}
              </Typography>
              <Chip
                label={cfg.label}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  bgcolor: cfg.bg,
                  color: cfg.color,
                  border: "none",
                }}
              />
              {isUnread && (
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    flexShrink: 0,
                    ml: "auto",
                    boxShadow: "0 0 6px rgba(25,118,210,0.7)",
                  }}
                />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5, mb: 0.75 }}
              >
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {formatDate(notification.createdAt)} · {formatTime(notification.createdAt)}
              </Typography>
            </Box>
          }
        />
      </ListItem>
    </Fade>
  );
}
