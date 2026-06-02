import React from "react";
import { Avatar, Card, CardContent, Typography, Box, Grid, IconButton } from "@mui/material";
import dayjs from "dayjs";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { FaMapMarkerAlt, FaEnvelope, FaCalendarAlt, FaBirthdayCake, FaIdCard, FaUserTie } from "react-icons/fa";

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
export default function MainProfile({ user, roles, onEditClick, isEditing }) {
  const calculateAge = (dob) => dayjs().diff(dayjs(dob), "year");

  return (
    <>
      <style>{`
        @keyframes subtleScale {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* CARD 1: Identity / Photo Card */}
      <Grid size={{ xs: 10, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 5, width: '100%',
            border: `1px solid rgba(184,151,42,0.15)`,
            boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
            fontFamily: "'Inter', sans-serif",
            display: "flex", flexDirection: "column",
            overflow: "hidden", position: "relative",
            background: "#fff",
            "&:hover .avatar-ring": {
              animation: "subtleScale 2s infinite ease-in-out"
            }
          }}
        >
          {/* Premium Top Background Detail */}
          <Box
            sx={{
              position: "absolute", top: 0, left: 0, right: 0, height: "140px",
              background: `linear-gradient(180deg, ${GOLD_BG} 0%, rgba(255,255,255,0) 100%)`,
              zIndex: 0
            }}
          >
            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4, backgroundImage: `radial-gradient(circle at 2px 2px, ${GOLD} 1px, transparent 0)`, backgroundSize: "24px 24px" }} />
          </Box>

          <CardContent sx={{ pt: 8, pb: 6, px: 4, textAlign: "center", flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>

            {/* Elegant Avatar */}
            <Box className="avatar-ring" sx={{ position: "relative", mb: 3 }}>
              {/* Outer decorative ring */}
              <Box sx={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1px dashed ${GOLD}60`, rotate: "-15deg" }} />
              {/* Inner shadow ring */}
              <Box sx={{ position: "absolute", inset: -3, borderRadius: "50%", border: `2px solid ${GOLD_LIGHT}`, zIndex: 0 }} />

              <Avatar
                src={user.imagePath}
                alt={user.userName}
                sx={{
                  width: 140, height: 140, border: "4px solid white",
                  background: `linear-gradient(135deg, #fdfdfc, ${GOLD_BG})`,
                  color: GOLD_DARK, fontSize: "3.5rem", fontWeight: 700,
                  boxShadow: `0 8px 24px rgba(184,151,42,0.2)`,
                  position: "relative", zIndex: 1
                }}
              >
                {user.userName?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>

            {/* User Name */}
            <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", fontSize: "1.8rem", mb: 1 }}>
              {user.userName}
            </Typography>

            {/* Role Badge */}
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, border: `1px solid ${GOLD}40`, px: 2.5, py: 0.7, borderRadius: 50, bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <FaUserTie size={12} color={GOLD} />
              <Typography sx={{ color: TEXT_MID, fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                {roles && roles.length > 0 ? roles[0] : "User"}
              </Typography>
            </Box>

          </CardContent>
        </Card>
      </Grid>

      {/* CARD 2: Personal Information (Hides when Editing) */}
      {!isEditing && (
        <Grid size={{ xs: 12, md: 4, lg: 3.2 }} sx={{ display: 'flex' }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 5, width: '100%', border: `1px solid rgba(184,151,42,0.15)`, boxShadow: "0 10px 40px rgba(0,0,0,0.04)", fontFamily: "'Inter', sans-serif",
              display: "flex", flexDirection: "column", background: "#fff"
            }}
          >
            <Box sx={{ borderBottom: `1px solid rgba(184,151,42,0.15)`, bgcolor: "#f9f8f5", px: { xs: 3, sm: 4 }, py: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 3, background: `linear-gradient(135deg, ${GOLD}, #96791e)`, display: "flex", alignItems: "center", justifyContent: "center", color: 'white', boxShadow: `0 4px 12px ${GOLD}40` }}>
                  <FaIdCard size={18} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", fontSize: "1.2rem" }}>
                  Personal Details
                </Typography>
              </Box>
              <IconButton
                onClick={onEditClick}
                sx={{ color: GOLD_DARK, bgcolor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", "&:hover": { bgcolor: GOLD_BG } }}
                title="Edit Profile"
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>

            <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { icon: <FaEnvelope size={18} />, label: "Email", value: user.email },
                  { icon: <FaMapMarkerAlt size={18} />, label: "Country", value: user.country || "Not specified" },
                  { icon: <FaBirthdayCake size={18} />, label: "Age", value: user.dateOfBirth ? `${calculateAge(user.dateOfBirth)} years` : "Not specified" },
                  { icon: <FaCalendarAlt size={18} />, label: "Member Since", value: user.registerDate ? dayjs(user.registerDate).format("DD/MM/YYYY") : "Not specified" },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex", alignItems: "center", gap: 2, py: 2, borderBottom: idx < 3 ? `1px solid rgba(184,151,42,0.08)` : "none"
                    }}
                  >
                    <Box sx={{ color: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ display: "flex", flex: 1, gap: 1, alignItems: "center" }}>
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
      )}
    </>
  );
}