import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, IconButton, Avatar, Chip, Stack, CircularProgress } from "@mui/material";
import { setPrice as SetPrice, getDoctorById } from '../../../services/doctorService';
import { useParams, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
const BORDER_CLR = "rgba(184,151,42,0.2)";

export default function UpdateDoctorPrice({ doctorId: propDoctorId, isDialog, open, onClose }) {
  const { id: paramId } = useParams();
  const id = propDoctorId || paramId;
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(isDialog ? true : false);

  useEffect(() => {
    if (id) {
      const fetchDoctor = async () => {
        try {
          const res = await getDoctorById(id);
          setDoctor(res.data);
          if (res.data.consulationPrice) setPrice(res.data.consulationPrice.toString());
        } catch (err) {
          console.error("Error fetching doctor:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchDoctor();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await SetPrice(id, { price: parseInt(price) });
      setSuccessMessage(response.message || "Doctor price updated successfully!");
      setOpenSuccessDialog(true);
    } catch (err) {
      setSuccessMessage("Error updating price. Please try again.");
      setOpenSuccessDialog(true);
    }
  };

  const handleCloseSuccess = () => {
    setOpenSuccessDialog(false);
    if (successMessage.includes("successfully")) {
      if (isDialog) {
        onClose();
      } else {
        navigate("/doctors");
      }
    }
  };

  const innerContent = (
    <Box sx={{ position: "relative" }}>
      {isDialog && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: TEXT_DARK }}>Update Settings</Typography>
          <IconButton onClick={onClose} sx={{ color: TEXT_MID }}><CloseIcon /></IconButton>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: GOLD }} />
        </Box>
      ) : (
        <>
          {doctor && (
            <Box
              sx={{
                borderRadius: 3,
                border: `1px solid ${BORDER_CLR}`,
                bgcolor: "#fff",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                overflow: "hidden",
                mb: 4,
              }}
            >
              {/* Gold top bar */}
              <Box sx={{ height: 4, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_DARK})` }} />

              <Box sx={{ p: 3, display: "flex", gap: 2.5, alignItems: "center" }}>
                <Avatar
                  src={doctor.imagePath || "/default-doctor.png"}
                  alt={doctor.userName}
                  sx={{
                    width: 70, height: 70,
                    border: `3px solid ${GOLD}40`,
                    boxShadow: `0 4px 20px ${GOLD}25`,
                  }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: TEXT_DARK, lineHeight: 1.2, mb: 0.5 }}>
                    Dr. {doctor.userName}
                  </Typography>
                  {doctor.specialityName && (
                    <Chip
                      icon={<LocalHospitalIcon sx={{ fontSize: "14px !important", color: `${GOLD} !important` }} />}
                      label={doctor.specialityName}
                      size="small"
                      sx={{ mb: 1, bgcolor: GOLD_BG, color: GOLD_DARK, border: `1px solid ${GOLD}30`, fontWeight: 600, fontSize: "0.7rem" }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          )}

          <Typography sx={{ color: TEXT_MID, fontSize: "0.95rem", fontWeight: 500, mb: 3, textAlign: isDialog ? "left" : "center" }}>
            Set the required consultation price for this doctor.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Consultation Price (EGP)" type="number" fullWidth value={price} onChange={(e) => setPrice(e.target.value)} required
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 3 },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: GOLD, borderWidth: "2px" },
                "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK }
              }}
            />
            <Button
              type="submit"
              fullWidth
              sx={{
                py: 1.6, borderRadius: 50, fontWeight: 700, fontSize: "1rem", color: "white",
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                boxShadow: `0 6px 20px ${GOLD}40`,
                "&:hover": { background: GOLD_DARK, transform: "translateY(-2px)" },
                transition: "all 0.25s",
                textTransform: "none"
              }}
            >
              Save Price
            </Button>
          </Box>
        </>
      )}

      <Dialog open={openSuccessDialog} onClose={handleCloseSuccess} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, bgcolor: GOLD_BG, borderBottom: `1px solid ${GOLD}20` }}>System Notice</DialogTitle>
        <DialogContent sx={{ pt: "24px !important" }}>
          <DialogContentText sx={{ color: TEXT_MID, fontWeight: 500 }}>{successMessage}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseSuccess} variant="contained" sx={{ bgcolor: GOLD, color: "white", borderRadius: 50, px: 3, "&:hover": { bgcolor: GOLD_DARK }, textTransform: "none" }}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return (
    <>
{isDialog ? (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: "#f9f8f5", p: 1 } }}>
          <DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
            {innerContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Box sx={{ minHeight: "90vh", bgcolor: "#f9f8f5", py: 10, fontFamily: "'Inter', sans-serif" }}>
          <Container maxWidth="sm">
            <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: `1px solid rgba(184,151,42,0.15)`, boxShadow: "0 12px 48px rgba(0,0,0,0.05)" }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", mb: 2, textAlign: "center" }}>
                Update Settings
              </Typography>
              {innerContent}
            </Paper>
          </Container>
        </Box>
      )}
    </>
  );
}
