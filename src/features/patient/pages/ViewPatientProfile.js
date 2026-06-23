import { useParams } from "react-router-dom";
import {
  Container, Card, CardContent, Typography, Grid, Box,
  Alert, Skeleton,
} from "@mui/material";
import { usePatientProfile } from "../hooks/usePatients";
import BreadcrumbHeader from "../../../components/BreadcrumbHeader";
import ProfileIdentityCard from "../../profile/components/ProfileIdentityCard";
import {
  FaEnvelope, FaGlobe, FaVenusMars, FaBirthdayCake,
  FaIdCard, FaCalendarAlt, FaHeartbeat, FaTint,
} from "react-icons/fa";
import dayjs from "dayjs";

import { GOLD, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";

export default function ViewPatientProfile() {
  const { id } = useParams();
  const { data: patientData, isLoading: loading, error: errorDoc } = usePatientProfile(id);

  const patient = patientData?.data || patientData;
  const error = errorDoc?.message;

  const calculateAge = (dob) => dayjs().diff(dayjs(dob), "year");

  const keyframes = `
    @keyframes subtleScale {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
  `;

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", pt: { xs: 5, md: 5 }, pb: 8, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="xl">
          <BreadcrumbHeader currentPage="Profile" />
          <Grid container spacing={3} alignItems="stretch" justifyContent="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }}>
              <Skeleton animation="wave" variant="rectangular" height={420} width="100%" sx={{ borderRadius: 5 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }}>
              <Skeleton animation="wave" variant="rectangular" height={420} width="100%" sx={{ borderRadius: 5 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }}>
              <Skeleton animation="wave" variant="rectangular" height={420} width="100%" sx={{ borderRadius: 5 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, fontFamily: "'Inter', sans-serif" }}>
        <Alert severity={error ? "error" : "warning"} sx={{ borderRadius: 3 }}>
          {error || "Patient not found!"}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <style>{keyframes}</style>

      <Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", pt: { xs: 5, md: 5 }, pb: 8, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth={false} sx={{ px: { xs: 1, md: 5, lg: 8 } }}>

          <BreadcrumbHeader currentPage="Profile" />

          <Grid container spacing={3} alignItems="stretch" justifyContent="center">

            {/* CARD 1: Identity / Photo Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3.5 }} sx={{ display: "flex" }}>
              <ProfileIdentityCard
                user={patient}
                roleLabel="Patient"
              />
            </Grid>

            {/* CARD 2: Personal Details */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4.5 }} sx={{ display: "flex" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 5,
                  width: "100%",
                  border: `1px solid rgba(184,151,42,0.15)`,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                }}
              >
                <Box
                  sx={{
                    borderBottom: `1px solid rgba(184,151,42,0.15)`,
                    bgcolor: "#f9f8f5",
                    px: { xs: 3, sm: 4 },
                    py: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${GOLD}, #96791e)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: `0 4px 12px ${GOLD}40`,
                      }}
                    >
                      <FaIdCard size={18} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", fontSize: "1.2rem" }}
                    >
                      Identity Details
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {[
                      { icon: <FaEnvelope size={18} />, label: "Email", value: patient.email },
                      { icon: <FaGlobe size={18} />, label: "Country", value: patient.country || "Not specified" },
                      { icon: <FaVenusMars size={18} />, label: "Gender", value: patient.gender || "Not specified" },
                      {
                        icon: <FaBirthdayCake size={18} />,
                        label: "Age",
                        value: patient.dateOfBirth ? `${calculateAge(patient.dateOfBirth)} years` : "Not specified",
                      },
                    ].map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderBottom: idx < 3 ? `1px solid rgba(184,151,42,0.08)` : "none",
                        }}
                      >
                        <Box sx={{ color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {item.icon}
                        </Box>
                        <Box sx={{ display: "flex", flex: 1, gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                          <Typography sx={{ color: TEXT_MID, fontWeight: 600, fontSize: "0.95rem" }}>
                            {item.label}:
                          </Typography>
                          <Typography sx={{ color: TEXT_DARK, fontWeight: 700, fontSize: "0.95rem", wordBreak: "break-all" }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD 3: Medical Information */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3.5 }} sx={{ display: "flex" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 5,
                  width: "100%",
                  border: `1px solid rgba(184,151,42,0.15)`,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                }}
              >
                <Box
                  sx={{
                    borderBottom: `1px solid rgba(184,151,42,0.15)`,
                    bgcolor: "#f9f8f5",
                    px: { xs: 3, sm: 4 },
                    py: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${GOLD}, #96791e)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        boxShadow: `0 4px 12px ${GOLD}40`,
                      }}
                    >
                      <FaHeartbeat size={18} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", fontSize: "1.2rem" }}
                    >
                      Medical Info
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {[
                      { icon: <FaTint size={18} />, label: "Blood Type", value: patient.bloodType || "N/A" },
                      { icon: <FaHeartbeat size={18} />, label: "History", value: patient.medicalHistory || "N/A" },
                      {
                        icon: <FaCalendarAlt size={18} />,
                        label: "Member Since",
                        value: patient.registerDate ? dayjs(patient.registerDate).format("DD/MM/YYYY") : "Not specified",
                      },
                    ].map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderBottom: idx < 2 ? `1px solid rgba(184,151,42,0.08)` : "none",
                        }}
                      >
                        <Box sx={{ color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {item.icon}
                        </Box>
                        <Box sx={{ display: "flex", flex: 1, gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                          <Typography sx={{ color: TEXT_MID, fontWeight: 600, fontSize: "0.95rem" }}>
                            {item.label}:
                          </Typography>
                          <Typography sx={{ color: TEXT_DARK, fontWeight: 700, fontSize: "0.95rem", wordBreak: "break-all" }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </>
  );
}