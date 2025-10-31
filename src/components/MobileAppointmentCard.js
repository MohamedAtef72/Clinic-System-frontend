import React from "react";
import {
  Card,
  CardContent,
  Chip,
  Typography,
  Stack,
  Grid,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { getStatusChipColor } from "./GetStatus";

const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    {icon}
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ minWidth: "50px" }}
    >
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value}
    </Typography>
  </Stack>
);

export const AppointmentCard = ({ appointment, onMenuOpen }) => {
  return (
    <Card
      sx={{
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
        borderRadius: 3,
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "rgba(0, 0, 0, 0.12) 0px 8px 16px",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              label={appointment.appointmentStatus}
              color={getStatusChipColor(appointment.appointmentStatus)}
              size="small"
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            />
            <IconButton onClick={(e) => onMenuOpen(e, appointment)} size="small">
              <MoreVertIcon />
            </IconButton>
          </Stack>

          {/* Doctor and Patient */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <MedicalServicesIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Doctor
                  </Typography>
                  <Typography fontWeight={600} color="primary.main">
                    Dr. {appointment.doctorName}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PersonIcon color="secondary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Patient
                  </Typography>
                  <Typography fontWeight={600}>
                    {appointment.patientName}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider />

          {/* Details */}
          <Stack spacing={1.5}>
            <InfoRow
              icon={<EventIcon fontSize="small" color="action" />}
              label="Date"
              value={
                appointment.startTime
                  ? new Date(appointment.startTime).toLocaleDateString()
                  : "N/A"
              }
            />
            <InfoRow
              icon={<AccessTimeIcon fontSize="small" color="action" />}
              label="Time"
              value={
                appointment.startTime && appointment.endTime
                  ? `${new Date(appointment.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${new Date(appointment.endTime).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}`
                  : "N/A"
              }
            />
            <InfoRow
              icon={<AttachMoneyIcon fontSize="small" color="success" />}
              label="Price"
              value={`${appointment.doctorPrice} EGP`}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};