import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Divider, Skeleton } from '@mui/material';
import { getDoctorById } from '../../../services/doctorService';
import { getPatientById } from '../../../services/patientService';
import { getDoctorAvailabilityById } from '../../../services/availabilityService';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from '../../../theme/tokens';

const STATUS_MAP = {
  completed: { bg: '#dcfce7', color: '#166534', label: 'Completed' },
  schedule:  { bg: '#fef9c3', color: '#854d0e', label: 'Pending'   },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
};

const getStatus = (s) => STATUS_MAP[s?.toLowerCase()] || { bg: '#f3f4f6', color: '#374151', label: s || 'Unknown' };

/**
 * Vertical card — matches the "shift monitor" person-card style from the reference.
 */
export default function DashboardAppointmentItem({ appointment }) {
  const statusCfg = getStatus(appointment.appointmentStatus || appointment.status);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointment) return;
    let cancelled = false;
    (async () => {
      try {
        const [doctorRes, patientRes, availRes] = await Promise.all([
          getDoctorById(appointment.doctorId),
          getPatientById(appointment.patientId),
          getDoctorAvailabilityById(appointment.availabilityId),
        ]);
        if (cancelled) return;
        const doc  = doctorRes?.data  || doctorRes;
        const pat  = patientRes?.data || patientRes;
        const avail = availRes?.Data   ?? availRes?.data ?? {};
        setDetails({
          doctorName:  doc?.userName  || 'N/A',
          patientName: pat?.userName  || 'N/A',
          doctorImage: doc?.imagePath || '',
          startTime:   avail?.StartTime ?? avail?.startTime,
        });
      } catch {/* silent */} finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [appointment]);

  const time = details?.startTime ? new Date(details.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
  const date = details?.startTime ? new Date(details.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

  return (
    <Box sx={{
      bgcolor: '#fff',
      borderRadius: 4,
      p: 2.5,
      border: '1px solid rgba(184,151,42,0.1)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      transition: 'all 0.22s ease',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 10px 28px ${GOLD}14`, borderColor: `${GOLD}35` },
    }}>
      {/* Top row: status badge + avatar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.8 }}>
        <Box sx={{ px: 1.5, py: 0.4, borderRadius: 50, bgcolor: statusCfg.bg }}>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: statusCfg.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {statusCfg.label}
          </Typography>
        </Box>
        <Avatar src={details?.doctorImage} sx={{ width: 38, height: 38, bgcolor: GOLD_BG, color: GOLD_DARK, fontSize: '0.9rem', fontWeight: 700, border: `2px solid white`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {loading ? '' : details?.doctorName?.charAt(0).toUpperCase()}
        </Avatar>
      </Box>

      {/* Patient name + role */}
      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: TEXT_DARK, mb: 0.2 }}>
        {loading ? <Skeleton width={110} /> : (details?.patientName || 'Patient')}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: TEXT_MID, mb: 1.8 }}>
        {loading ? <Skeleton width={70} /> : 'Patient'}
      </Typography>

      <Divider sx={{ borderColor: 'rgba(184,151,42,0.08)', mb: 1.8 }} />

      {/* Doctor + Time */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '0.68rem', color: TEXT_MID, fontWeight: 600, mb: 0.3 }}>Doctor</Typography>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: TEXT_DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {loading ? <Skeleton width={80} /> : `Dr. ${details?.doctorName}`}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <Typography sx={{ fontSize: '0.68rem', color: TEXT_MID, fontWeight: 600, mb: 0.3 }}>Time / Date</Typography>
          {loading ? <Skeleton width={55} height={16} /> : (
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: TEXT_DARK }}>
              {time || '—'}<br />
              <span style={{ fontSize: '0.7rem', color: TEXT_MID, fontWeight: 500 }}>{date}</span>
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
