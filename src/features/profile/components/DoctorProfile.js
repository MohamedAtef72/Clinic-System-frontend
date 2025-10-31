import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import {
  FaStethoscope,
  FaAward,
  FaClock,
} from "react-icons/fa";

export default function DoctorProfile({ user }) {
const calculateExperience = (registerDate) => {
    // 1. Calculate the total number of months
    const totalMonths = dayjs().diff(dayjs(registerDate), "months");

    // 2. Calculate the number of full years
    const years = Math.floor(totalMonths / 12);

    // 3. Calculate the remaining months
    const months = totalMonths % 12;

    // 4. Return a clear string
    if (years > 0) {
      return `${years} year(s) and ${months} month(s)`;
    } else {
      return `${months} months`;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)",
      }}
    >
      <CardContent sx={{ pt: 4, pb: 4, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#1e293b",
            mb: 3,
            textAlign: "center",
          }}
        >
          👨‍⚕️ Doctor Information
        </Typography>

        <Grid container spacing={2.5}>
          {/* Speciality */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: "#F0FDF4",
                border: "2px solid #DCFCE7",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "#DCFCE7",
                  borderColor: "#10B981",
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.15)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box sx={{ mt: 0.5, color: "#10B981", display: "flex" }}>
                  <FaStethoscope size={20} />
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
                    Speciality
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {user.user.specialityName || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Experience */}
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: "#F0FDF4",
                border: "2px solid #DCFCE7",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "#DCFCE7",
                  borderColor: "#10B981",
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.15)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box sx={{ mt: 0.5, color: "#10B981", display: "flex" }}>
                  <FaAward size={20} />
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
                    Experience
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {user?.user?.registerDate
                      ? calculateExperience(user.user.registerDate)
                      : "N/A"}{" "}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}