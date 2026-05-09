import React from 'react';
import { Grid } from '@mui/material';
import StatCard from './StatCard';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function DashboardStatsGrid({ stats, loading, onShowDoctors, onShowPatients, onShowAppointments }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 7, md: 5, lg: 4 }}>
        <StatCard
          title="Total Doctors"
          count={stats?.doctorsCount || 0}
          icon={<MedicalServicesIcon />}
          color="#3b82f6"
          loading={loading}
          buttonText="View Doctors"
          onButtonClick={onShowDoctors}
          trend="+3% this month"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 7, md: 5, lg: 4 }}>
        <StatCard
          title="Total Patients"
          count={stats?.patientsCount || 0}
          icon={<PeopleIcon />}
          color="#10b981"
          loading={loading}
          buttonText="View Patients"
          onButtonClick={onShowPatients}
          trend="+15% this month"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
        <StatCard
          title="Total Appointments"
          count={stats?.appointmentsCount || 0}
          icon={<CalendarMonthIcon />}
          color="#f59e0b"
          loading={loading}
          buttonText="View Appointments"
          onButtonClick={onShowAppointments}
          trend="+60% this month"
        />
      </Grid>
    </Grid>
  );
}
