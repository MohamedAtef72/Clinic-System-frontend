import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaCalendarAlt, FaBirthdayCake } from "react-icons/fa";

export default function MainProfile({ user }) {
  const navigate = useNavigate();

  const calculateAge = (dob) => {
    return dayjs().diff(dayjs(dob), "year");
  };

  return (
    <>
      {/* Main Profile Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          overflow: "hidden",
          mb: 4,
          background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
        }}
      >
        {/* Header Background */}
        <Box
          sx={{
            height: 150,
            background: "#e8e8f0cc",
            position: "relative",
            overflow: "hidden",
          }}
        />

        <CardContent sx={{ pt: 0, pb: 4, px: { xs: 2, sm: 4 } }}>
          {/* Avatar Section */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: -8, mb: 3 }}>
            <Avatar
              src={user.user.imagePath}
              alt={user.user.userName}
              sx={{
                width: 160,
                height: 160,
                border: "8px solid white",
                mb: 2,
                backgroundColor: "#E3F2FD",
                fontSize: "60px",
              }}
            />

            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                fontWeight: 800,
                color: "#1e293b",
                mb: 0.5,
              }}
            >
              {user.user.userName}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontWeight: 600,
                mb: 2,
              }}
            >
              {user.role[0]}
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate('/edit-Profile')}
              startIcon={<EditSquareIcon />}
              sx={{
                background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                textTransform: 'none',
                fontSize: '16px',
                py: 1.2,
                px: 3,
                borderRadius: 2,
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 30px rgba(33, 150, 243, 0.3)",
                },
              }}
            >
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Information Grid */}
          <Grid container spacing={2.5}>
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
                  "&:hover": {
                    background: "#E3F2FD",
                    borderColor: "#2196F3",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(33, 150, 243, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ mt: 0.5, color: "#2196F3", display: "flex" }}>
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
                      {user.user.email}
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
                  "&:hover": {
                    background: "#DBEAFE",
                    borderColor: "#0EA5E9",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(14, 165, 233, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ mt: 0.5, color: "#0EA5E9", display: "flex" }}>
                    <FaMapMarkerAlt size={20} />
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
                      {user.user.country}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Age */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "#FAF5FF",
                  border: "2px solid #F3E8FF",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#F3E8FF",
                    borderColor: "#A855F7",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(168, 85, 247, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ mt: 0.5, color: "#A855F7", display: "flex" }}>
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
                      Age
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {user?.user?.dateOfBirth ? calculateAge(user.user.dateOfBirth) : "N/A"} years
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Registration Date */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "#FFF7ED",
                  border: "2px solid #FEEDDE",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#FEEDDE",
                    borderColor: "#F97316",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(249, 115, 22, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ mt: 0.5, color: "#F97316", display: "flex" }}>
                    <FaCalendarAlt size={20} />
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
                      Member Since
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      {user.user.registerDate
                        ? dayjs(user.user.registerDate).format("MMM DD, YYYY")
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}