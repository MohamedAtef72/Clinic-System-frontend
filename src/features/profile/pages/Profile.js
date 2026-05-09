import { Box, Container, CircularProgress, Alert, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import BreadcrumbHeader from '../../../components/BreadcrumbHeader';
import MainProfile from "../components/MainProfile";
import DoctorProfile from "../components/DoctorProfile";
import PatientProfile from "../components/PatientProfile";
import ReceptionistProfile from "../components/ReceptionistProfile";
import EditProfile from "./EditProfile";
import { userProfile } from '../../../services/userService';
import { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_MID } from "../../../theme/tokens";
/* Normalize PascalCase API user to camelCase */
const normalizeUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    id: u.Id ?? u.id,
    userName: u.UserName ?? u.userName,
    email: u.Email ?? u.email,
    country: u.Country ?? u.country,
    dateOfBirth: u.DateOfBirth ?? u.dateOfBirth,
    registerDate: u.RegisterDate ?? u.registerDate,
    imagePath: u.ImagePath ?? u.imagePath,
    specialityName: u.SpecialityName ?? u.specialityName,
    bloodType: u.BloodType ?? u.bloodType,
    medicalHistory: u.MedicalHistory ?? u.medicalHistory,
    shiftStart: u.ShiftStart ?? u.shiftStart,
    shiftEnd: u.ShiftEnd ?? u.shiftEnd,
    consulationPrice: u.ConsulationPrice ?? u.consulationPrice,
  };
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const getUserData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const res = await userProfile();
      setUser(normalizeUser(res.user || null));
      setRoles(res.role || []);
    } catch (err) {
      setError(err.message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const renderRoleComponent = () => {
    if (!user || !roles || roles.length === 0) return null;
    switch (roles[0]) {
      case "Doctor": return <DoctorProfile user={user} />;
      case "Patient": return <PatientProfile user={user} />;
      case "Receptionist": return <ReceptionistProfile user={user} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <CircularProgress size={50} sx={{ color: GOLD, mb: 3 }} />
        <Typography sx={{ color: TEXT_MID, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Loading Secure Dashboard...</Typography>
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, fontFamily: "'Inter', sans-serif" }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <>
<Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", pt: { xs: 5, md: 5 }, pb: 5, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="xl">

          <BreadcrumbHeader currentPage="Profile" />

          <Grid container spacing={3} alignItems="stretch" justifyContent="center">
            {user && <MainProfile user={user} roles={roles} onEditClick={() => setIsEditing(true)} />}
            {renderRoleComponent()}
          </Grid>
        </Container>
      </Box>

      {isEditing && (
        <EditProfile
          isDialog={true}
          open={isEditing}
          onClose={() => {
            setIsEditing(false);
            getUserData(false);
          }}
        />
      )}
    </>
  )
}