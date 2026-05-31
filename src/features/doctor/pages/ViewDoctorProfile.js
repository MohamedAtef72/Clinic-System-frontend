import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardContent, Typography, Grid, Box, Alert, Breadcrumbs, Link, Avatar, Divider, Rating, Skeleton } from "@mui/material";
import { useDoctorProfile, useDoctorRating } from "../hooks/useDoctors";
import { FaEnvelope, FaGlobe, FaVenusMars, FaBirthdayCake, FaStethoscope, FaUserTie, FaIdCard, FaStar, FaCalendarAlt } from "react-icons/fa";
import dayjs from "dayjs";
import BreadcrumbHeader from "../../../components/BreadcrumbHeader";

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
export default function ViewDoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: doctorData, isLoading: loadingDoc, error: errorDoc } = useDoctorProfile(id);
  const { data: ratingData, isLoading: loadingRating } = useDoctorRating(id);

  const doctor = doctorData?.data || doctorData;
  const rating = ratingData?.data?.averageRate || 0;
  const totalRatings = ratingData?.data?.totalRatings || 0;
  const loading = loadingDoc;
  const error = errorDoc?.message;

  const calculateAge = (dob) => dayjs().diff(dayjs(dob), "year");

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", pt: { xs: 5, md: 5 }, pb: 8, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="xl">
          <BreadcrumbHeader currentPage="Profile" />
          <Grid container spacing={3} alignItems="stretch" justifyContent="center">
            {/* Identity Card Skeleton */}
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <Skeleton animation="wave" variant="rectangular" height={450} width="100%" sx={{ borderRadius: 5 }} />
            </Grid>
            {/* Details Card Skeleton */}
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <Skeleton animation="wave" variant="rectangular" height={450} width="100%" sx={{ borderRadius: 5 }} />
            </Grid>
            {/* Professional Card Skeleton */}
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <Skeleton animation="wave" variant="rectangular" height={450} width="100%" sx={{ borderRadius: 5 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, fontFamily: "'Inter', sans-serif" }}>
        <Alert severity={error ? "error" : "warning"} sx={{ borderRadius: 3 }}>
          {error || "Doctor not found!"}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <style>{`
        @keyframes subtleScale {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>

      <Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", pt: { xs: 5, md: 5 }, pb: 8, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="xl">

          <BreadcrumbHeader currentPage="Profile" />

          <Grid container spacing={3} alignItems="stretch" justifyContent="center">

            {/* CARD 1: Identity / Photo Card */}
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 5, width: '100%', border: `1px solid rgba(184,151,42,0.15)`, boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                  display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", background: "#fff",
                  "&:hover .avatar-ring": { animation: "subtleScale 2s infinite ease-in-out" }
                }}
              >
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: "140px", background: `linear-gradient(180deg, ${GOLD_BG} 0%, rgba(255,255,255,0) 100%)`, zIndex: 0 }}>
                  <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4, backgroundImage: `radial-gradient(circle at 2px 2px, ${GOLD} 1px, transparent 0)`, backgroundSize: "24px 24px" }} />
                </Box>

                <CardContent sx={{ pt: 8, pb: 6, px: 4, textAlign: "center", flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  <Box className="avatar-ring" sx={{ position: "relative", mb: 3 }}>
                    <Box sx={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px dashed ${GOLD}60`, rotate: "-15deg" }} />
                    <Box sx={{ position: "absolute", inset: -3, borderRadius: "50%", border: `2px solid ${GOLD_LIGHT}`, zIndex: 0 }} />
                    <Avatar
                      src={doctor.imagePath}
                      alt={doctor.userName}
                      sx={{
                        width: 140, height: 140, border: "4px solid white", background: `linear-gradient(135deg, #fdfdfc, ${GOLD_BG})`,
                        color: GOLD_DARK, fontSize: "3.5rem", fontWeight: 700, boxShadow: `0 8px 24px rgba(184,151,42,0.2)`, position: "relative", zIndex: 1
                      }}
                    >
                      {doctor.userName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", fontSize: "1.8rem", mb: 1 }}>
                    Dr. {doctor.userName}
                  </Typography>
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, border: `1px solid ${GOLD}40`, px: 2.5, py: 0.7, borderRadius: 50, bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <FaUserTie size={12} color={GOLD} />
                    <Typography sx={{ color: TEXT_MID, fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                      Doctor
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD 2: Personal Details */}
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 5, width: '100%', border: `1px solid rgba(184,151,42,0.15)`, boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                  display: "flex", flexDirection: "column", background: "#fff"
                }}
              >
                <Box sx={{ borderBottom: `1px solid rgba(184,151,42,0.15)`, bgcolor: "#f9f8f5", px: { xs: 3, sm: 4 }, py: 3, display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 3, background: `linear-gradient(135deg, ${GOLD}, #96791e)`, display: "flex", alignItems: "center", justifyContent: "center", color: 'white', boxShadow: `0 4px 12px ${GOLD}40` }}>
                      <FaIdCard size={18} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", fontSize: "1.2rem" }}>
                      Identity Details
                    </Typography>
                  </Box>
                </Box>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { icon: <FaEnvelope size={18} />, label: "Email", value: doctor.email },
                      { icon: <FaGlobe size={18} />, label: "Country", value: doctor.country || "Not specified" },
                      { icon: <FaVenusMars size={18} />, label: "Gender", value: doctor.gender || "Not specified" },
                      { icon: <FaBirthdayCake size={18} />, label: "Age", value: doctor.dateOfBirth ? `${calculateAge(doctor.dateOfBirth)} years` : "Not specified" },
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderBottom: idx < 3 ? `1px solid rgba(184,151,42,0.08)` : "none" }}>
                        <Box sx={{ color: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</Box>
                        <Box sx={{ display: "flex", flex: 1, gap: 1, alignItems: "center" }}>
                          <Typography sx={{ color: TEXT_MID, fontWeight: 600, fontSize: "0.95rem" }}>{item.label}:</Typography>
                          <Typography sx={{ color: TEXT_DARK, fontWeight: 700, fontSize: "0.95rem", wordBreak: "break-all" }}>{item.value}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD 3: Professional Information */}
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 5, width: '100%', border: `1px solid rgba(184,151,42,0.15)`, boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                  display: "flex", flexDirection: "column", background: "#fff"
                }}
              >
                <Box sx={{ borderBottom: `1px solid rgba(184,151,42,0.15)`, bgcolor: "#f9f8f5", px: { xs: 3, sm: 4 }, py: 3, display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 3, background: `linear-gradient(135deg, ${GOLD}, #96791e)`, display: "flex", alignItems: "center", justifyContent: "center", color: 'white', boxShadow: `0 4px 12px ${GOLD}40` }}>
                      <FaStethoscope size={18} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", fontSize: "1.2rem" }}>
                      Professional Info
                    </Typography>
                  </Box>
                </Box>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { icon: <FaStethoscope size={18} />, label: "Speciality", value: doctor.specialityName || "Not specified" },
                      { icon: <FaCalendarAlt size={18} />, label: "Member Since", value: doctor.registerDate ? dayjs(doctor.registerDate).format("DD/MM/YYYY") : "Not specified" },
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderBottom: `1px solid rgba(184,151,42,0.08)` }}>
                        <Box sx={{ color: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</Box>
                        <Box sx={{ display: "flex", flex: 1, gap: 1, alignItems: "center" }}>
                          <Typography sx={{ color: TEXT_MID, fontWeight: 600, fontSize: "0.95rem" }}>{item.label}:</Typography>
                          <Typography sx={{ color: TEXT_DARK, fontWeight: 700, fontSize: "0.95rem", wordBreak: "break-all" }}>{item.value}</Typography>
                        </Box>
                      </Box>
                    ))}

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2, mt: 1, bgcolor: GOLD_BG, borderRadius: 3, border: `1px solid ${GOLD}30` }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <FaStar size={16} color={GOLD} />
                        <Typography sx={{ color: TEXT_MID, fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Patient Rating</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                        <Typography sx={{ fontWeight: 800, color: TEXT_DARK, fontSize: "2rem", lineHeight: 1 }}>{rating.toFixed(1)}</Typography>
                        <Typography sx={{ color: TEXT_MID, fontWeight: 600, fontSize: "1rem" }}>/ 5</Typography>
                      </Box>
                      <Typography sx={{ color: TEXT_MID, fontSize: "0.8rem", fontWeight: 500 }}>Based on {totalRatings} verified reviews</Typography>
                    </Box>
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