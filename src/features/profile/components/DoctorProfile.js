import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import { FaStethoscope, FaAward } from "react-icons/fa";

import { GOLD, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";

export default function DoctorProfile({ user }) {
  const calculateExperience = (registerDate) => {
    const totalMonths = dayjs().diff(dayjs(registerDate), "months");
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years > 0) return `${years} year(s) and ${months} month(s)`;
    return `${months} months`;
  };

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3.2 }} sx={{ display: "flex" }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 5,
          width: "100%",
          border: `1px solid rgba(184,151,42,0.15)`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        {/* Card header */}
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
              <FaStethoscope size={18} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: TEXT_DARK,
                letterSpacing: "-0.5px",
                fontSize: "1.2rem",
              }}
            >
              Medical Details
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                icon: <FaStethoscope size={18} />,
                label: "Speciality",
                value: user.specialityName || "Not specified",
              },
              {
                icon: <FaAward size={18} />,
                label: "Experience",
                value: user?.registerDate
                  ? calculateExperience(user.registerDate)
                  : "Not specified",
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderBottom: idx < 1 ? `1px solid rgba(184,151,42,0.08)` : "none",
                }}
              >
                <Box
                  sx={{
                    color: GOLD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                    gap: 1,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography sx={{ color: TEXT_MID, fontWeight: 600, fontSize: "0.95rem" }}>
                    {item.label}:
                  </Typography>
                  <Typography sx={{ color: TEXT_DARK, fontWeight: 700, fontSize: "0.95rem" }}>
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}