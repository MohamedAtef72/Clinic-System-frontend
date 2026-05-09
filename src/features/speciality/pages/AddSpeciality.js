import React, { useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BiotechIcon from "@mui/icons-material/Biotech";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ScienceIcon from "@mui/icons-material/Science";
import SpecialityForm from "../components/SpecialityForm";
import { addSpeciality } from '../../../services/specialityService';
import { useNavigate } from "react-router-dom";

import { GOLD, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
/* ── Left-panel highlights ── */
const HIGHLIGHTS = [
  { icon: <BiotechIcon />, text: "Expand clinic medical domains" },
  { icon: <ScienceIcon />, text: "Enable new treatments and expertise" },
  { icon: <PsychologyIcon />, text: "Attract specialized medical professionals" },
  { icon: <CheckCircleIcon />, text: "Provide comprehensive patient care" },
];

const AddSpeciality = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddSpeciality = async (name) => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Speciality name is required");
      return;
    }

    try {
      setLoading(true);
      await addSpeciality({ Name: name });
      setSuccessMsg("Speciality added successfully!");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Failed to add speciality");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes panelFadeIn { from { opacity:0; transform:translateX(-24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes formFadeIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmerGold { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      `}</style>

      <Box sx={{ overflowX: "hidden", display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", bgcolor: "#f9f8f5" }}>

        {/* LEFT PANEL */}
        <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", width: "40%", flexShrink: 0, position: "relative", overflow: "hidden", animation: "panelFadeIn 0.7s ease both" }}>
          <Box sx={{ position: "absolute", inset: 0, backgroundImage: "url('/login_panel_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(20,18,32,.55) 0%,rgba(20,18,32,.78) 60%,rgba(20,18,32,.94) 100%)" }} />
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />

          <Box sx={{ position: "relative", zIndex: 1, p: { md: 5, lg: 7 } }}>
            <Box onClick={() => navigate("/")} sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, cursor: "pointer", mb: 7 }}>
              <LocalHospitalIcon sx={{ color: GOLD, fontSize: 28 }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "white", lineHeight: 1.1 }}>MedClinic</Typography>
                <Typography sx={{ fontSize: "0.58rem", fontWeight: 600, color: GOLD, letterSpacing: "1.5px", textTransform: "uppercase" }}>Professional Care</Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: { md: "1.9rem", lg: "2.4rem" }, fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: "-0.5px", mb: 1 }}>Expand Medical</Typography>
            <Typography sx={{
              fontSize: { md: "1.9rem", lg: "2.4rem" }, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px", mb: 3,
              background: `linear-gradient(90deg,${GOLD},#f0d070,${GOLD})`,
              backgroundSize: "200%", animation: "shimmerGold 4s ease infinite",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Domains.</Typography>
            <Typography sx={{ color: "rgba(255,255,255,.6)", fontSize: "0.9rem", lineHeight: 1.7, maxWidth: 320, mb: 5 }}>
              Introduce new medical specialities to broaden our healthcare offerings.
              Enable patients to find the specialized care they need.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {HIGHLIGHTS.map((h, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${GOLD}33,${GOLD}66)`, border: `1px solid ${GOLD}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {React.cloneElement(h.icon, { sx: { color: GOLD, fontSize: 16 } })}
                  </Box>
                  <Typography sx={{ color: "rgba(255,255,255,.75)", fontSize: "0.84rem" }}>{h.text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ position: "relative", zIndex: 1, p: { md: 5, lg: 7 }, pt: 0 }}>
            <Box sx={{ height: 1, background: `linear-gradient(90deg,transparent,${GOLD}40,transparent)`, mb: 3 }} />
            <Typography sx={{ color: "rgba(255,255,255,.35)", fontSize: "0.75rem" }}>© 2025 MedClinic Pro. Administrative Tools.</Typography>
          </Box>
        </Box>

        {/* RIGHT PANEL */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", px: { xs: 3, sm: 5, lg: 8 }, py: 5, animation: "formFadeIn 0.7s 0.1s ease both" }}>
          <Box onClick={() => navigate("/")} sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4, cursor: "pointer" }}>
            <LocalHospitalIcon sx={{ color: GOLD, fontSize: 26 }} />
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: TEXT_DARK }}>MedClinic <span style={{ color: GOLD }}>Pro</span></Typography>
          </Box>

          <Box sx={{ width: "100%", maxWidth: 440 }}>
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Box sx={{ display: "inline-flex", width: 64, height: 64, borderRadius: 3, background: `linear-gradient(135deg,${GOLD_LIGHT},#fdf3d0)`, border: `1.5px solid ${GOLD}40`, alignItems: "center", justifyContent: "center", mb: 2.5, animation: "floatY 4s ease-in-out infinite", boxShadow: `0 8px 24px ${GOLD}25` }}>
                <MedicalServicesIcon sx={{ color: GOLD, fontSize: 32 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-1px", mb: 1 }}>New Speciality</Typography>
              <Typography sx={{ color: TEXT_MID, fontSize: "0.95rem" }}>Expanding our medical expertise range</Typography>
            </Box>

            <Box sx={{ bgcolor: "white", p: 4, borderRadius: 4, boxShadow: "0 12px 48px rgba(0,0,0,0.06)", border: `1px solid rgba(184,151,42,0.15)` }}>
              {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{successMsg}</Alert>}
              {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{errorMsg}</Alert>}

              <SpecialityForm onSubmit={handleAddSpeciality} loading={loading} />
            </Box>

            <Typography sx={{ textAlign: "center", color: TEXT_MID, fontSize: "0.85rem", mt: 4 }}>
              Ensure the speciality name is unique and correctly spelled before adding.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddSpeciality;
