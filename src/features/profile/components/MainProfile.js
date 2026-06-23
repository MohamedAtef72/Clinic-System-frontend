import React from "react";
import { Card, CardContent, Typography, Box, Grid, IconButton } from "@mui/material";
import dayjs from "dayjs";
import { FaMapMarkerAlt, FaEnvelope, FaCalendarAlt, FaBirthdayCake, FaIdCard } from "react-icons/fa";
import ProfileIdentityCard from "./ProfileIdentityCard";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";

/**
 * MainProfile — renders the identity card + personal details card for own-profile view.
 *
 * When `isEditing` is true, only the identity card is shown (centered) so
 * the EditProfile dialog can occupy the right side of the layout.
 */
export default function MainProfile({ user, roles, onEditClick, isEditing }) {
  const calculateAge = (dob) => dayjs().diff(dayjs(dob), "year");

  const roleLabel = roles && roles.length > 0 ? roles[0] : "User";

  return (
    <>
      {/* CARD 1: Identity / Photo Card */}
      <Grid
        size={{
          xs: 12,
          sm: isEditing ? 12 : 6,
          md: isEditing ? 5 : 4,
          lg: isEditing ? 4 : 3,
        }}
        sx={{ display: "flex", mx: isEditing ? "auto" : 0 }}
      >
        <ProfileIdentityCard
          user={user}
          roleLabel={roleLabel}
          onEditClick={onEditClick}
        />
      </Grid>

      {/* CARD 2: Personal Information (hidden when editing) */}
      {!isEditing && (
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
                justifyContent: "space-between",
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
                  sx={{
                    fontWeight: 800,
                    color: TEXT_DARK,
                    letterSpacing: "-0.5px",
                    fontSize: "1.2rem",
                  }}
                >
                  Personal Details
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: { xs: 3, sm: 4 }, flexGrow: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { icon: <FaEnvelope size={18} />, label: "Email", value: user.email },
                  {
                    icon: <FaMapMarkerAlt size={18} />,
                    label: "Country",
                    value: user.country || "Not specified",
                  },
                  {
                    icon: <FaBirthdayCake size={18} />,
                    label: "Age",
                    value: user.dateOfBirth
                      ? `${calculateAge(user.dateOfBirth)} years`
                      : "Not specified",
                  },
                  {
                    icon: <FaCalendarAlt size={18} />,
                    label: "Member Since",
                    value: user.registerDate
                      ? dayjs(user.registerDate).format("DD/MM/YYYY")
                      : "Not specified",
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 2,
                      borderBottom:
                        idx < 3 ? `1px solid rgba(184,151,42,0.08)` : "none",
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
                      <Typography
                        sx={{ color: TEXT_MID, fontWeight: 600, fontSize: "0.95rem" }}
                      >
                        {item.label}:
                      </Typography>
                      <Typography
                        sx={{
                          color: TEXT_DARK,
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          wordBreak: "break-all",
                        }}
                      >
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