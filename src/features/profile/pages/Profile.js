import { Box, Container, CircularProgress, Alert } from "@mui/material";
import MainProfile from "../components/MainProfile";
import DoctorProfile from "../components/DoctorProfile";
import PatientProfile from "../components/PatientProfile";
import ReceptionistProfile from "../components/ReceptionistProfile";
import { userProfile } from '../../../services/authService';
import { useState, useEffect } from "react";

export default function Profile() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userProfile();
        setUser(data);
      } catch (err) {
        console.error("Fetch Data failed. Please check your credentials.");
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const renderRoleComponent = () => {
    if (!user || !user.role) return null;

    switch (user.role[0]) {
      case "Doctor":
        return <DoctorProfile user={user} />;
      case "Patient":
        return <PatientProfile user={user} />;
      case "Receptionist":
        return <ReceptionistProfile user={user} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
          }}
        >
          <CircularProgress size={60} sx={{ color: "#2196F3", mb: 2 }} />
          <Box sx={{ fontSize: "18px", color: "#666", fontWeight: 500 }}>
            Loading your profile...
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            fontSize: "16px",
            py: 2,
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        {user && <MainProfile user={user} />}
        {renderRoleComponent()}
      </Box>
    </Container>
  );
}