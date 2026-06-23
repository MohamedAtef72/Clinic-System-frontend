import { Box, Container, Alert, Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import BreadcrumbHeader from '../../../components/BreadcrumbHeader';
import MainProfile from "../components/MainProfile";
import DoctorProfile from "../components/DoctorProfile";
import PatientProfile from "../components/PatientProfile";
import ReceptionistProfile from "../components/ReceptionistProfile";
import EditProfile from "./EditProfile";
import { userProfile } from '../../../services/userService';
import { useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from "@tanstack/react-query";



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
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const getUserData = async () => {
    const res = await userProfile();
    return {
      user: normalizeUser(res.user || null),
      roles: res.role || []
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getUserData,
  });

  const user = data?.user || null;
  const roles = data?.roles || [];

  const renderRoleComponent = () => {
    if (!user || !roles || roles.length === 0) return null;
    switch (roles[0]) {
      case "Doctor": return <DoctorProfile user={user} />;
      case "Patient": return <PatientProfile user={user} />;
      case "Receptionist": return <ReceptionistProfile user={user} />;
      default: return null;
    }
  };

  return (
    <>
      {/* Global keyframes for avatar hover animation */}
      <style>{`
        @keyframes subtleScale {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>

      <Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", pt: { xs: 5, md: 5 }, pb: 5, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="xl">

          <BreadcrumbHeader currentPage="Profile" />

          {error && !user && !isLoading ? (
            <Container maxWidth="md" sx={{ mt: 5 }}>
              <Alert severity="error" sx={{ borderRadius: 3 }}>{error?.message || String(error)}</Alert>
            </Container>
          ) : (
            <Grid container spacing={3} alignItems="stretch" justifyContent="center">
              {isLoading ? (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
                    <Skeleton animation="wave" variant="rectangular" width="100%" height={380} sx={{ borderRadius: 5 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3.2 }} sx={{ display: 'flex' }}>
                    <Skeleton animation="wave" variant="rectangular" width="100%" height={380} sx={{ borderRadius: 5 }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3.2 }} sx={{ display: 'flex' }}>
                    <Skeleton animation="wave" variant="rectangular" width="100%" height={380} sx={{ borderRadius: 5 }} />
                  </Grid>
                </>
              ) : (
                <>
                  {user && (
                    <MainProfile
                      user={user}
                      roles={roles}
                      onEditClick={() => setIsEditing(true)}
                      isEditing={isEditing}
                    />
                  )}
                  {!isEditing && renderRoleComponent()}
                </>
              )}
            </Grid>
          )}
        </Container>
      </Box>

      {isEditing && (
        <EditProfile
          isDialog={true}
          open={isEditing}
          onClose={() => {
            setIsEditing(false);
            refetch();
          }}
        />
      )}
    </>
  )
}