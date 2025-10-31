import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Box,
  Divider,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { getStatusChipColor } from "../../../components/GetStatus"; 

const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    {icon}
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: "40px" }}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value}
    </Typography>
  </Stack>
);

export const PatientAppointmentCard = ({ appointment, onShowNotes, onRateDoctor }) => {
  const hasRated = appointment.hasRated; 

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
              <Typography variant="caption" color="text.secondary">Appointment with</Typography>
              <Typography variant="h6" fontWeight={600} color="primary.main">
                Dr. {appointment.doctor.userName || "N/A"}
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
            <InfoRow
              icon={<EventIcon fontSize="small" color="action" />}
              label="Date"
              value={appointment.startTime ? new Date(appointment.startTime).toLocaleDateString() : "N/A"}
            />
            <InfoRow
              icon={<AccessTimeIcon fontSize="small" color="action" />}
              label="Time"
              value={appointment.startTime ? new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}
            />
            <InfoRow
              icon={<AttachMoneyIcon fontSize="small" color="action" />}
              label="Price"
              value={`${appointment.doctorPrice || 0} EGP`}
            />
          </Stack>
          
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => onShowNotes(appointment.visitId)}
              disabled={!appointment.visitId || appointment.appointmentStatus !== 'Completed'}
            >
              Show Visit Notes
            </Button>
            <Button
              variant="contained"
              onClick={() => onRateDoctor(appointment.doctor, appointment.id, hasRated)}
              disabled={appointment.appointmentStatus !== 'Completed'}
            >
              {hasRated ? "View / Edit Rating" : "Rate Doctor"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};