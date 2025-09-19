import { Box } from "@mui/material";
import MainProfile from "../components/MainProfile";
import DoctorProfile from "../components/DoctorProfile";
import PatientProfile from "../components/PatientProfile";
import ReceptionistProfile from "../components/ReceptionistProfile";
import { userProfile } from '../services/authService';
import { useState, useEffect } from "react";

export default function Profile() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await userProfile();
        setUser(data);
      } catch (err) {
        console.error("Fetch Data failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []); // important → run once

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

  if (loading) return <p>Loading...</p>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      {user && <MainProfile user={user} />}
      {renderRoleComponent()}
    </Box>
  );
}
