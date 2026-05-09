import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Alert, Box, Paper, Fade, Button } from '@mui/material';
import { getDashboardStats, getRecentData } from '../../../services/adminService';
import { getAllAppointments } from '../../../services/appointmentService';
import DashboardStatsGrid from '../components/DashboardStatsGrid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardAppointmentItem from '../components/DashboardAppointmentItem';

import { GOLD, GOLD_BG, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
function DashboardPage() {
  const navigate = useNavigate();
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, recentResponse, recentAppointmentsResponse] = await Promise.all([
        getDashboardStats(),
        getRecentData(),
        getAllAppointments("", page)
      ]);

      setStats(statsResponse?.data || statsResponse);
      setRecentData(recentResponse?.data || recentResponse);
      setRecentAppointments(recentAppointmentsResponse?.data || recentAppointmentsResponse);

    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(err.message || "Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);


  const handleShowDoctors = () => navigate('/doctors');
  const handleShowPatients = () => navigate('/patients');
  const handleShowAppointments = () => navigate('/all-appointments');

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#f9f9fb',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: `linear-gradient(135deg, ${GOLD} 0%, #96791e 100%)`,
              color: 'white',
              boxShadow: '0 10px 30px rgba(184,151,42,0.25)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    letterSpacing: '-0.5px'
                  }}
                >
                  System Dashboard
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Welcome back! Here's what's happening in your clinic today.
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'rgba(255,255,255,0.15)',
                px: 2.5, py: 1,
                borderRadius: 3,
                backdropFilter: 'blur(10px)'
              }}>
                <AccessTimeIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Error Alert */}
        {error && (
          <Fade in>
            <Alert
              severity="error"
              variant="filled"
              sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(211, 47, 47, 0.2)'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Main Grid Layout */}
        <Grid container spacing={4}>

          {/* Left Side: Stats and Activity (Column) */}
          <Grid size={{ xs: 12, lg: 7.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* Stats Grid */}
              <DashboardStatsGrid
                stats={stats}
                loading={loading}
                onShowDoctors={handleShowDoctors}
                onShowPatients={handleShowPatients}
                onShowAppointments={handleShowAppointments}
              />

              {/* Recent Activity Feed */}
              <Fade in timeout={800}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    border: '1px solid rgba(184,151,42,0.15)',
                    background: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: TEXT_DARK,
                        mb: 1
                      }}
                    >
                      Daily Snapshot
                    </Typography>
                    <Typography variant="body2" sx={{ color: TEXT_MID }}>
                      Summary of today's key performance indicators and new registrations.
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {[
                      {
                        title: 'New Patients Today',
                        value: recentData?.newPatientsToday || '0',
                        color: GOLD,
                        desc: 'Active registrations'
                      },
                      {
                        title: 'Appointments Today',
                        value: recentData?.appointmentsToday || '0',
                        color: GOLD,
                        desc: 'Scheduled visits'
                      },
                    ].map((item, index) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: `${item.color}08`,
                            border: '1px solid',
                            borderColor: `${item.color}20`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 12px 24px ${item.color}15`,
                              borderColor: `${item.color}40`
                            }
                          }}
                        >
                          <Typography variant="caption" sx={{ color: TEXT_MID, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              color: item.color,
                              fontSize: { xs: '1.75rem', sm: '2.25rem' },
                              my: 0.5,
                              lineHeight: 1.2
                            }}
                          >
                            {loading ? '...' : item.value}
                          </Typography>
                          <Typography variant="caption" sx={{ color: TEXT_MID, opacity: 0.8 }}>
                            {item.desc}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Fade>
            </Box>
          </Grid>

          {/* Right Side: Latest Appointments (Feed) */}
          <Grid size={{ xs: 12, lg: 4.5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2 },
                borderRadius: 4,
                border: '1px solid rgba(184,151,42,0.15)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: TEXT_DARK }}>Latest Appointments</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_MID }}>Real-time clinic activity</Typography>
                </Box>
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/all-appointments')}
                  sx={{
                    color: GOLD,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    "&:hover": { bgcolor: GOLD_BG }
                  }}
                >
                  See All
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                {loading && !recentAppointments.length ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <Box key={i} sx={{ height: 85, bgcolor: '#f3f4f6', borderRadius: 3, animation: 'pulse 1.5s infinite ease-in-out', opacity: 0.6 }} />
                  ))
                ) : recentAppointments.length > 0 ? (
                  recentAppointments.slice(0, 6).map(appt => (
                    <DashboardAppointmentItem key={appt.id} appointment={appt} />
                  ))
                ) : (
                  <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    bgcolor: GOLD_BG,
                    borderRadius: 4,
                    border: '1.5px dashed rgba(184,151,42,0.3)',
                    my: 'auto'
                  }}>
                    <CalendarMonthIcon sx={{ fontSize: 48, color: GOLD, opacity: 0.2, mb: 2 }} />
                    <Typography sx={{ color: TEXT_MID, fontWeight: 600 }}>No recent appointments</Typography>
                    <Typography variant="caption" sx={{ color: TEXT_MID, opacity: 0.7 }}>Activity will appear here once booked</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;