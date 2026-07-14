import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Typography, Alert, Box,
  Paper, Button, Skeleton, Divider, Fade, Stack
} from '@mui/material';
import DashboardAppointmentItem from '../components/DashboardAppointmentItem';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { useDashboardStats, useRecentData } from '../hooks/useDashboard';
import { useAllAppointments } from '../../appointments/hooks/useAppointments';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from '../../../theme/tokens';

/* ─── Constants ─────────────────────────────── */
const now = new Date();
const dateShort = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
const dateFull = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'schedule', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

/* ─── Sub-component: Today big-number card ─── */
function TodayCard({ icon, label, value, loading, sublabel }) {
  return (
    <Box sx={{
      flex: 1, p: { xs: 3, sm: 3.5 },
      bgcolor: '#fff', borderRadius: 4,
      border: '1px solid rgba(184,151,42,0.12)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      transition: 'all 0.25s ease',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 10px 28px ${GOLD}12`, borderColor: `${GOLD}35` },
    }}>
      <Box sx={{ width: 44, height: 44, borderRadius: 3, background: `linear-gradient(135deg, ${GOLD_BG}, ${GOLD_LIGHT})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD_DARK, border: `1px solid ${GOLD}22`, mb: 2 }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: TEXT_MID, textTransform: 'uppercase', letterSpacing: '1px', mb: 0.8 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 800, color: TEXT_DARK, fontSize: '2.4rem', lineHeight: 1, mb: 0.4 }}>
        {loading ? <Skeleton width={60} height={38} /> : (value ?? '—')}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', color: TEXT_MID }}>{sublabel}</Typography>
    </Box>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
function DashboardPage() {
  usePageTitle('Admin Dashboard');
  const navigate = useNavigate();
  const [monitorTab, setMonitorTab] = useState('all');

  const { data: stats, isLoading: loadingStats, error: statsError } = useDashboardStats();
  const { data: recent, isLoading: loadingRecent, error: recentError } = useRecentData();
  const { data: apptRes, isLoading: loadingAppts, error: apptError } = useAllAppointments('', 1);

  const error = statsError?.message || recentError?.message || apptError?.message || null;
  const allAppts = apptRes?.data || apptRes || [];
  const filtered = monitorTab === 'all'
    ? allAppts
    : allAppts.filter(a => (a.appointmentStatus || a.status)?.toLowerCase() === monitorTab);
  const displayAppts = filtered.slice(0, 6);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f5f7', fontFamily: "'Inter', sans-serif", pt: { xs: 2, sm: 3, md: 4 }, pb: 8 }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <Container maxWidth="xl">

        {/* Error */}
        {error && (
          <Fade in>
            <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>
          </Fade>
        )}

        {/* ══ MAIN LAYOUT ══════════════════════════════════════════════════════ */}
        <Grid container spacing={3}>

          {/* ── LEFT COLUMN — BLACK SIDEBAR STYLE FOR STATS ──────────────────── */}
          <Grid size={{ xs: 12, lg: 3.5 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 4.5, 
                bgcolor: '#0d0d12', 
                p: { xs: 3, md: 4 }, 
                border: '1px solid rgba(255,255,255,0.05)', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeUp 0.4s ease both',
                minHeight: { lg: '85vh' }
              }}
            >
              {/* Sidebar Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d0d12', fontWeight: 900, fontSize: '1.1rem' }}>
                  M
                </Box>
                <Typography sx={{ fontWeight: 900, color: '#fff', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                  MedClinic
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 4 }} />

              {/* Sidebar Stats Title */}
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px', mb: 2 }}>
                System Metrics
              </Typography>

              {/* Stats Stack */}
              <Stack spacing={3}>
                {/* Total Doctors */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3.5,
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(184, 151, 42, 0.12)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: GOLD,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      boxShadow: `0 8px 30px ${GOLD}15`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${GOLD}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, border: `1px solid ${GOLD}25` }}>
                      <MedicalServicesIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Total Doctors
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                        +3% this month
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', mb: 2, lineHeight: 1 }}>
                    {loadingStats ? <Skeleton sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} width={50} /> : (stats?.doctorsCount ?? '—')}
                  </Typography>

                  <Button
                    onClick={() => navigate('/doctors')}
                    fullWidth
                    sx={{
                      py: 0.8,
                      borderRadius: 2,
                      border: `1.2px solid ${GOLD}40`,
                      color: GOLD,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: GOLD,
                        color: '#0d0d12',
                        borderColor: GOLD
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    View Doctors
                  </Button>
                </Box>

                {/* Total Patients */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3.5,
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(184, 151, 42, 0.12)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: GOLD,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      boxShadow: `0 8px 30px ${GOLD}15`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${GOLD}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, border: `1px solid ${GOLD}25` }}>
                      <PeopleIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Total Patients
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                        +15% this month
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', mb: 2, lineHeight: 1 }}>
                    {loadingStats ? <Skeleton sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} width={50} /> : (stats?.patientsCount ?? '—')}
                  </Typography>

                  <Button
                    onClick={() => navigate('/patients')}
                    fullWidth
                    sx={{
                      py: 0.8,
                      borderRadius: 2,
                      border: `1.2px solid ${GOLD}40`,
                      color: GOLD,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: GOLD,
                        color: '#0d0d12',
                        borderColor: GOLD
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    View Patients
                  </Button>
                </Box>

                {/* Total Appointments */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3.5,
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(184, 151, 42, 0.12)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: GOLD,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      boxShadow: `0 8px 30px ${GOLD}15`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${GOLD}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, border: `1px solid ${GOLD}25` }}>
                      <CalendarMonthIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Total Appointments
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                        +60% this month
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', mb: 2, lineHeight: 1 }}>
                    {loadingStats ? <Skeleton sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} width={50} /> : (stats?.appointmentsCount ?? '—')}
                  </Typography>

                  <Button
                    onClick={() => navigate('/all-appointments')}
                    fullWidth
                    sx={{
                      py: 0.8,
                      borderRadius: 2,
                      border: `1.2px solid ${GOLD}40`,
                      color: GOLD,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: GOLD,
                        color: '#0d0d12',
                        borderColor: GOLD
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    View Appointments
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* ── RIGHT COLUMN — CONTENT & MONITOR ─────────────────────────────── */}
          <Grid size={{ xs: 12, lg: 8.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>

              {/* ══ PAGE HEADER ══════════════════════════════════════════════════════ */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, animation: 'fadeUp 0.4s ease both' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '1.5px', mb: 0.5 }}>
                    {greeting} 👋
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.5px', fontSize: { xs: '1.6rem', sm: '2rem' } }}>
                    Dashboard
                  </Typography>
                  <Typography sx={{ color: TEXT_MID, fontSize: '0.9rem', mt: 0.4 }}>
                    Here's what's happening in your clinic today.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#fff', border: '1px solid rgba(184,151,42,0.18)', px: 2.5, py: 1.2, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#22c55e', animation: 'livePulse 2s infinite', flexShrink: 0 }} />
                  <AccessTimeIcon sx={{ fontSize: 16, color: TEXT_MID }} />
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: TEXT_DARK }}>{dateFull}</Typography>
                </Box>
              </Box>

              {/* Today's Activity */}
              <Paper elevation={0} sx={{ borderRadius: 4, bgcolor: '#fff', border: '1px solid rgba(184,151,42,0.12)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', overflow: 'hidden', animation: 'fadeUp 0.4s 0.15s ease both', opacity: 0, animationFillMode: 'forwards' }}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(184,151,42,0.1)' }}>
                  <Typography sx={{ fontWeight: 800, color: TEXT_DARK, fontSize: '1.05rem' }}>Today's Activity</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: TEXT_MID, mt: 0.3 }}>{dateShort}</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                  <TodayCard icon={<PeopleAltOutlinedIcon sx={{ fontSize: 22 }} />} label="New Patients" value={recent?.newPatientsToday} loading={loadingRecent} sublabel="Registered today" />
                  <TodayCard icon={<EventAvailableOutlinedIcon sx={{ fontSize: 22 }} />} label="Appointments" value={recent?.appointmentsToday} loading={loadingRecent} sublabel="Scheduled today" />
                </Box>
              </Paper>

              {/* Clinic's Monitor */}
              <Paper elevation={0} sx={{
                borderRadius: 4, bgcolor: '#fff',
                border: '1px solid rgba(184,151,42,0.12)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                animation: 'fadeUp 0.4s 0.2s ease both', opacity: 0, animationFillMode: 'forwards',
              }}>
                {/* Monitor Header */}
                <Box sx={{ px: { xs: 3, sm: 4 }, pt: 3, pb: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: TEXT_DARK, fontSize: '1.05rem' }}>Clinic's Monitor</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: TEXT_MID, mt: 0.3 }}>— {dateShort}</Typography>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: '0.82rem !important' }} />}
                      onClick={() => navigate('/all-appointments')}
                      sx={{ color: GOLD_DARK, borderColor: `${GOLD}45`, border: '1px solid', fontWeight: 700, textTransform: 'none', fontSize: '0.78rem', borderRadius: 50, px: 2, '&:hover': { bgcolor: GOLD_BG, borderColor: GOLD } }}
                    >
                      See All
                    </Button>
                  </Box>

                  {/* Tabs */}
                  <Box sx={{ display: 'flex', gap: 0 }}>
                    {TABS.map(tab => (
                      <Box
                        key={tab.key}
                        onClick={() => setMonitorTab(tab.key)}
                        sx={{
                          px: 2.5, py: 1.2, cursor: 'pointer', position: 'relative',
                          color: monitorTab === tab.key ? GOLD_DARK : TEXT_MID,
                          fontWeight: monitorTab === tab.key ? 700 : 500,
                          fontSize: '0.85rem',
                          transition: 'color 0.2s',
                          '&::after': {
                            content: '""', position: 'absolute', bottom: 0, left: 0, right: 0,
                            height: '2.5px', borderRadius: '2px 2px 0 0',
                            bgcolor: GOLD,
                            opacity: monitorTab === tab.key ? 1 : 0,
                            transition: 'opacity 0.2s',
                          },
                          '&:hover': { color: TEXT_DARK },
                        }}
                      >
                        {tab.label}
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(184,151,42,0.1)' }} />

                {/* Appointment cards grid */}
                <Box sx={{ p: { xs: 2.5, sm: 3 }, flexGrow: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: `${GOLD}30`, borderRadius: 4 } }}>
                  {loadingAppts && !allAppts.length ? (
                    <Grid container spacing={2}>
                      {[1, 2, 3, 4].map(i => (
                        <Grid key={i} size={{ xs: 12, sm: 6 }}>
                          <Skeleton variant="rectangular" height={155} sx={{ borderRadius: 4 }} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : displayAppts.length > 0 ? (
                    <Grid container spacing={2}>
                      {displayAppts.map(appt => (
                        <Grid key={appt.id} size={{ xs: 12, sm: 6 }}>
                          <DashboardAppointmentItem appointment={appt} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 10, bgcolor: GOLD_BG, borderRadius: 4, border: '1.5px dashed rgba(184,151,42,0.28)', mx: 1 }}>
                      <CalendarMonthIcon sx={{ fontSize: 52, color: GOLD, opacity: 0.25, mb: 2 }} />
                      <Typography sx={{ color: TEXT_MID, fontWeight: 700, fontSize: '0.95rem', mb: 0.4 }}>No appointments found</Typography>
                      <Typography variant="caption" sx={{ color: TEXT_MID, opacity: 0.65 }}>
                        {monitorTab === 'all' ? 'Activity will appear once booked' : `No ${monitorTab} appointments`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>

            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;