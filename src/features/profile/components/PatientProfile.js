import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import {
  FaTint,
  FaHeartbeat,
} from "react-icons/fa";

export default function PatientProfile({ user }) {
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
          🏥 Patient Information
        </Typography>

        <Grid container spacing={2.5}>
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
                    {user.user.bloodType || "N/A"}
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
                    {user.user.medicalHistory || "N/A"}
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