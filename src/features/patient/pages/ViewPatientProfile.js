import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPatientById,
} from "../../../services/authService";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Rating,
  Chip,
  Avatar,
  Divider,
  Alert,
  Paper,
} from "@mui/material";
import {
  FaEnvelope,
  FaGlobe,
  FaVenusMars,
  FaBirthdayCake,
  FaCalendarAlt,
  FaTint,
  FaHeartbeat,} from "react-icons/fa";

export default function ViewpatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPatientById(id);
        setPatient(res.data);

      } catch (err) {
        setError("Failed to load patient profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPatient();
    }
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} sx={{ color: "#2196F3", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666", fontWeight: 500 }}>
            Loading patient profile...
          </Typography>
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

  if (!patient) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert
          severity="warning"
          sx={{
            borderRadius: 2,
            fontSize: "16px",
            py: 2,
          }}
        >
          Patient not found!
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          overflow: "hidden",
          background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
        }}
      >
        {/* Header Background */}
        <Box
          sx={{
            height: 160,
            background: "#e8e8f0cc",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
          }}
        />

        <CardContent sx={{ pt: 0, pb: 4 }}>
          {/* Profile Section */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: -8, mb: 3 }}>
            <Avatar
              src={patient.imagePath}
              alt={patient.userName}
              sx={{
                width: 180,
                height: 180,
                border: "8px solid white",
                mb: 2,
                backgroundColor: "#E3F2FD",
                fontSize: "60px",
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#1e293b",
                textAlign: "center",
                mb: 1,
              }}
            >
              {patient.userName}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Professional Information Section */}
          <Typography
            variant="overline"
            sx={{
              display: "block",
              color: "#1565C0",
              fontWeight: 700,
              letterSpacing: 1.5,
              mb: 2.5,
              fontSize: "13px",
            }}
          >
            📋 Professional Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "#F8FBFF",
                  border: "2px solid #E3F2FD",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    background: "#E3F2FD",
                    borderColor: "#2196F3",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(33, 150, 243, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box
                    sx={{
                      mt: 0.5,
                      color: "#2196F3",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaEnvelope size={20} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#64748b",
                        fontWeight: 700,
                        mb: 0.5,
                        textTransform: "uppercase",
                        fontSize: "12px",
                      }}
                    >
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "14px",
                        wordBreak: "break-all",
                      }}
                    >
                      {patient.email}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Country */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "#F0F9FF",
                  border: "2px solid #DBEAFE",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    background: "#DBEAFE",
                    borderColor: "#0EA5E9",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(14, 165, 233, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box
                    sx={{
                      mt: 0.5,
                      color: "#0EA5E9",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaGlobe size={20} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#64748b",
                        fontWeight: 700,
                        mb: 0.5,
                        textTransform: "uppercase",
                        fontSize: "12px",
                      }}
                    >
                      Country
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {patient.country}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "#FAF5FF",
                  border: "2px solid #F3E8FF",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    background: "#F3E8FF",
                    borderColor: "#A855F7",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(168, 85, 247, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box
                    sx={{
                      mt: 0.5,
                      color: "#A855F7",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaVenusMars size={20} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#64748b",
                        fontWeight: 700,
                        mb: 0.5,
                        textTransform: "uppercase",
                        fontSize: "12px",
                      }}
                    >
                      Gender
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {patient.gender}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "#FFF7ED",
                  border: "2px solid #FEEDDE",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    background: "#FEEDDE",
                    borderColor: "#F97316",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(249, 115, 22, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box
                    sx={{
                      mt: 0.5,
                      color: "#F97316",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaBirthdayCake size={20} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#64748b",
                        fontWeight: 700,
                        mb: 0.5,
                        textTransform: "uppercase",
                        fontSize: "12px",
                      }}
                    >
                      Date of Birth
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>    

          </Grid>

          {/* Medical Information Section */}
          <Typography
            variant="overline"
            sx={{
              display: "block",
              color: "#1565C0",
              fontWeight: 700,
              letterSpacing: 1.5,
              mb: 2.5,
              fontSize: "13px",
            }}
          >
            📋 Medical Information
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Blood Type */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "#FEF2F2",
                  border: "2px solid #FECACA",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#FECACA",
                    borderColor: "#EF4444",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(239, 68, 68, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ mt: 0.5, color: "#EF4444", display: "flex" }}>
                    <FaTint size={20} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#64748b",
                        fontWeight: 700,
                        mb: 0.5,
                        textTransform: "uppercase",
                        fontSize: "12px",
                      }}
                    >
                      Blood Type
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {patient.bloodType || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Medical History */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "#FEF2F2",
                  border: "2px solid #FECACA",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#FECACA",
                    borderColor: "#EF4444",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(239, 68, 68, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ mt: 0.5, color: "#EF4444", display: "flex" }}>
                    <FaHeartbeat size={20} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#64748b",
                        fontWeight: 700,
                        mb: 0.5,
                        textTransform: "uppercase",
                        fontSize: "12px",
                      }}
                    >
                      Medical History
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "14px",
                        wordBreak: "break-word",
                      }}
                    >
                      {patient.medicalHistory || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid> 

          </Grid>

          {/* Platform Information Section */}
          <Typography
            variant="overline"
            sx={{
              display: "block",
              color: "#1565C0",
              fontWeight: 700,
              letterSpacing: 1.5,
              mb: 2.5,
              fontSize: "13px",
            }}
          >
            📋 Platform Information
          </Typography>
          
          {/* Registration Date Section */}
          <Paper
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
              borderRadius: 2,
              p: 2.5,
              border: "2px solid #BAE6FD",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ color: "#0369A1", display: "flex", alignItems: "center" }}>
              <FaCalendarAlt size={24} />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#0369A1",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "11px",
                  mb: 0.5,
                }}
              >
                Member Since
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#1e293b",
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                {new Date(patient.registerDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Paper>
        </CardContent>
      </Card>
    </Container>
  );
}