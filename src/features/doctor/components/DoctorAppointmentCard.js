import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Button, Box, Divider } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getStatusChipColor } from "../../../components/GetStatus"; 

export const DoctorAppointmentCard = ({ appointment, onAddNotes, onShowNotes, onShowRate }) => {
  const isVisitAddActive = appointment.appointmentStatus === "CheckedIn";
  const isVisitUpdateActive = appointment.appointmentStatus === "Completed";

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
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="caption" color="text.secondary">Patient</Typography>
              <Typography variant="h6" fontWeight={600} color="primary.main">
                {appointment.patientName}
              </Typography>
            </Box>
            <Chip
              label={appointment.appointmentStatus}
              color={getStatusChipColor(appointment.appointmentStatus)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2">{appointment.startTime ? new Date(appointment.startTime).toLocaleDateString() : "N/A"}</Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2">{appointment.startTime ? new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</Typography>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
            <Button
              variant="contained"
              onClick={() => onAddNotes(appointment.visitId, appointment.id)}
              disabled={!isVisitAddActive}
            >
              Add Notes
            </Button>
            <Button
              variant="contained"
              onClick={() => onAddNotes(appointment.visitId, appointment.id)}
              disabled={!isVisitUpdateActive}
            >
              Update Notes
            </Button>
            <Button
              variant="outlined"
              onClick={() => onShowNotes(appointment.visitId)}
              disabled={!appointment.visitId}
            >
              View Notes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => onShowRate(appointment.id)}
              disabled={appointment.appointmentStatus !== 'Completed'}
            >
              View Rating
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};