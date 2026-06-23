import React from 'react';
import { Grid } from '@mui/material';
import StatCard from './StatCard';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function DashboardStatsGrid({ stats, loading, onShowDoctors, onShowPatients, onShowAppointments }) {
  const cards = [
    { title: 'Total Doctors', count: stats?.doctorsCount || 0, icon: <MedicalServicesIcon />, loading, buttonText: 'View Doctors', onButtonClick: onShowDoctors, trend: '+3% this month' },
    { title: 'Total Patients', count: stats?.patientsCount || 0, icon: <PeopleIcon />, loading, buttonText: 'View Patients', onButtonClick: onShowPatients, trend: '+15% this month' },
    { title: 'Total Appointments', count: stats?.appointmentsCount || 0, icon: <CalendarMonthIcon />, loading, buttonText: 'View Appointments', onButtonClick: onShowAppointments, trend: '+60% this month' },
  ];

  return (
    <Grid container spacing={1.5}>
      {cards.map((c, i) => (
        <Grid key={i} size={{ xs: 12, sm: 4 }} sx={{ display: 'flex' }}>
          <StatCard {...c} />
        </Grid>
      ))}
    </Grid>
  );
}
