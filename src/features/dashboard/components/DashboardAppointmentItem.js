import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Chip, Skeleton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getDoctorById } from '../../../services/doctorService';
import { getPatientById } from '../../../services/patientService';
import { getDoctorAvailabilityById } from '../../../services/availabilityService';

import { GOLD, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return { bg: '#dcfce7', text: '#166534', dot: '#22c55e' };
    case 'schedule': return { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' };
    case 'cancelled': return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' };
    default: return { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' };
  }
};

export default function DashboardAppointmentItem({ appointment }) {
  const status = getStatusColor(appointment.appointmentStatus);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Fetch details for this specific appointment
        const [doctorRes, patientRes, availabilityRes] = await Promise.all([
          getDoctorById(appointment.doctorId),
          getPatientById(appointment.patientId),
          getDoctorAvailabilityById(appointment.availabilityId),
        ]);

        const doctorData = doctorRes?.data || doctorRes;
        const patientData = patientRes?.data || patientRes;
        const availabilityData = availabilityRes?.Data ?? availabilityRes?.data ?? {};

        setDetails({
          doctorName: doctorData?.userName || "N/A",
          patientName: patientData?.userName || "N/A",
          patientImage: patientData?.image || appointment.patientImage,
          startTime: availabilityData?.StartTime ?? availabilityData?.startTime,
          doctorImage: doctorData?.imagePath || appointment.doctorImage,
        });
      } catch (err) {
        console.error("Error fetching appointment details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (appointment) {
      fetchDetails();
    }
  }, [appointment]);

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', p: 2,
      borderRadius: 3, border: '1px solid rgba(184,151,42,0.08)',
      bgcolor: '#fff', transition: 'all 0.2s ease',
      "&:hover": { bgcolor: '#fdf8ec', borderColor: 'rgba(184,151,42,0.2)', transform: 'translateX(4px)' }
    }}>
      {/* Patient Avatar & info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
        <Avatar
          src={details?.doctorImage}
          sx={{ width: 40, height: 40, border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, color: TEXT_DARK, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {loading ? <Skeleton width={100} /> : (details?.patientName || appointment.patientName)}
          </Typography>
          <Typography sx={{ color: TEXT_MID, fontSize: '0.75rem' }}>
            {loading ? <Skeleton width={80} /> : `With Dr. ${details?.doctorName || appointment.doctorName}`}
          </Typography>
        </Box>
      </Box>

      {/* Date & Time */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 3, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <CalendarMonthIcon sx={{ fontSize: 16, color: GOLD }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK }}>
            {loading ? <Skeleton width={60} /> : (new Date(details.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <AccessTimeIcon sx={{ fontSize: 16, color: GOLD }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK }}>
            {loading ? <Skeleton width={60} /> : (new Date(details.startTime).toLocaleDateString())}
          </Typography>
        </Box>
      </Box>

      {/* Status */}
      <Chip
        label={appointment.status}
        size="small"
        sx={{
          height: 24, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
          bgcolor: status.bg, color: status.text, border: 'none',
          '& .MuiChip-label': { px: 1.5 }
        }}
      />
    </Box>
  );
}
