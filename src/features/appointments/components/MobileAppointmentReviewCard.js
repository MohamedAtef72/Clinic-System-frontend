import React from "react";
import {
  Card,
  CardContent,
  Chip,
  Typography,
  Stack,
  Grid,
  Box,
  Button,
  Divider,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { getStatusChipColor } from "../../../components/GetStatus";

export const AppointmentReviewCard = ({ appointment, onShowRate }) => {
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
          <Stack direction="row" justifyContent="flex-end">
            <Chip
              label={appointment.appointmentStatus}
              color={getStatusChipColor(appointment.appointmentStatus)}
              size="small"
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            />
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <MedicalServicesIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Doctor</Typography>
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
                  <Typography variant="caption" color="text.secondary">Patient</Typography>
                  <Typography fontWeight={600}>
                    {appointment.patientName}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider />

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: "40px" }}>Date</Typography>
              <Typography variant="body2" fontWeight={500}>
                {appointment.startTime ? new Date(appointment.startTime).toLocaleDateString() : "N/A"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: "40px" }}>Time</Typography>
              <Typography variant="body2" fontWeight={500}>
                {appointment.startTime
                  ? `${new Date(appointment.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "N/A"}
              </Typography>
            </Stack>
          </Stack>

          <Button
            variant="contained"
            fullWidth
            onClick={() => onShowRate(appointment.id)}
            sx={{ mt: 1, py: 1.25 }}
            disabled={appointment.appointmentStatus !== "Completed"}
          >
            Show Rating
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};