import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Alert, 
  Box,
  Paper,
  Fade
} from '@mui/material';
import { getDashboardStats  , getRecentData} from "../../../services/authService";
import StatCard from '../components/StatCard';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentData , setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, recentResponse] = await Promise.all([
        getDashboardStats(),
        getRecentData(),
      ]);

      setStats(statsResponse.data);
      setRecentData(recentResponse.data);

    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data. Please try again.");
      setStats(null);
      setRecentData(null);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();

  const interval = setInterval(fetchDashboardData, 30000);
  return () => clearInterval(interval);
}, []);


  const handleShowDoctors = () => {
    navigate('/doctors');
  };

  const handleShowPatients = () => {
    navigate('/patients');
  };

  const handleShowAppointments = () => {
    navigate('/all-appointments');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#ebeaeaff',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 2.5, sm: 4 },
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'black',
                    mb: 1,
                  }}
                >
                  Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Welcome back! Here's an overview of your system.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <AccessTimeIcon />
                <Typography variant="body2">
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
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Stats Grid - This was already perfectly responsive */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Doctors"
              count={stats?.doctorsCount || 0}
              icon={<MedicalServicesIcon />}
              color="#3b82f6"
              loading={loading}
              buttonText="View All Doctors"
              onButtonClick={handleShowDoctors}
              trend="+12% from last month"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Patients"
              count={stats?.patientsCount || 0}
              icon={<PeopleIcon />}
              color="#10b981"
              loading={loading}
              buttonText="View All Patients"
              onButtonClick={handleShowPatients}
              trend="+8% from last month"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Appointments"
              count={stats?.appointmentsCount || 0}
              icon={<CalendarMonthIcon />}
              color="#f59e0b"
              loading={loading}
              buttonText="View All Appointments"
              onButtonClick={handleShowAppointments}
              trend="+23% from last month"
            />
          </Grid>
        </Grid>

        <Fade in timeout={800}>
          <Paper 
            sx={{ 
              p: { xs: 2.5, sm: 4 },
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: '#1f2937', 
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Recent Activity
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Track the latest updates and activities in your healthcare management system.
            </Typography>
            
            {/* This grid is also perfectly responsive */}
            <Grid container spacing={2}>
              {[
                { title: 'New Patient Registrations', value: recentData?.newPatientsToday || '0', color: '#10b981' },
                { title: 'Appointments Today', value: recentData?.appointmentsToday || '0', color: '#3b82f6' },
              ].map((item, index) => (
                // It will stack on xs (12) and be 3-across on sm (4)
                <Grid item xs={12} sm={4} key={index}>
                  <Box 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: 2, 
                      bgcolor: `${item.color}10`,
                      border: '1px solid',
                      borderColor: `${item.color}30`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${item.color}20`
                      }
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      {item.title}
                    </Typography>
                    <Typography 
                      // Responsive variant
                      variant={{ xs: 'h5', sm: 'h4' }} 
                      sx={{ fontWeight: 700, color: item.color }}
                    >
                      {loading ? '...' : item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default DashboardPage;