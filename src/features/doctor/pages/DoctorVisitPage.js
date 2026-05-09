import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getVisitById, updateVisit } from '../../../services/visitService';
import { updateAppointment } from '../../../services/appointmentService';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper } from "@mui/material";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
export default function DoctorVisitPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [notes, setNotes] = useState("");
  const [medicine, setMedicine] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await getVisitById(id);
        setVisit(res.data);
        setNotes(res.data?.doctorNotes || "");
        setMedicine(res.data?.medicine || "");
      } catch (error) {
        console.error("Error loading visit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisit();
  }, [id]);

  const handleSave = async () => {
    try {
      const newVisitData = {
        ...visit,
        doctorNotes: notes,
        medicine: medicine,
        visitStatus: "Completed",
      }
      await updateVisit(id, newVisitData);
      setOpenDialog(true);
    } catch (error) {
      alert("Failed to update visit details");
    }
  };

  const handleConfirmComplete = async () => {
    try {
      await updateAppointment(appointmentId, { appointmentStatus: "Completed" });
      navigate("/doctor-appointments");
    } catch (error) {
      console.error("Error completing appointment:", error);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: GOLD, borderWidth: "2px" },
    "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK },
  };

  if (loading) return <Box sx={{ textAlign: "center", py: 10 }}><CircularProgress sx={{ color: GOLD }} /></Box>;
  if (!visit) return <Alert severity="error">Failed to load visit details.</Alert>;

  return (
    <>
<Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", py: 8, px: { xs: 2, sm: 4 }, fontFamily: "'Inter', sans-serif" }}>

        <Paper elevation={0} sx={{ maxWidth: 650, mx: "auto", p: { xs: 3, sm: 5 }, borderRadius: 4, border: `1px solid ${GOLD}25`, boxShadow: "0 12px 48px rgba(0,0,0,0.05)" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.5px", mb: 3, textAlign: "center" }}>
            Edit Visit Notes
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, p: 2, bgcolor: GOLD_BG, borderRadius: 2, border: `1px solid ${GOLD}40` }}>
            <Typography sx={{ color: TEXT_DARK, fontWeight: 700 }}>Consultation Status</Typography>
            <Typography sx={{ color: GOLD_DARK, fontWeight: 800, fontSize: "1.1rem" }}>{visit.price} EGP</Typography>
          </Box>

          <TextField label="Doctor Notes" multiline rows={6} fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ ...inputSx, mb: 3 }} />
          <TextField label="Prescribed Medicine" multiline rows={4} fullWidth value={medicine} onChange={(e) => setMedicine(e.target.value)} sx={{ ...inputSx, mb: 4 }} />

          <Button
            variant="contained" fullWidth onClick={handleSave}
            sx={{ py: 1.8, borderRadius: 50, fontWeight: 700, fontSize: "1rem", color: "white", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, boxShadow: `0 6px 20px ${GOLD}40`, "&:hover": { background: GOLD_DARK, transform: "translateY(-2px)" }, transition: "all 0.25s" }}
          >
            Save Visit Details
          </Button>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700, bgcolor: GOLD_BG, borderBottom: `1px solid ${GOLD}20` }}>Appointment Completed</DialogTitle>
            <DialogContent sx={{ pt: "24px !important" }}>
              <DialogContentText sx={{ color: TEXT_MID }}>
                Notes and medicine saved successfully.<br /><br />
                Do you want to finalize and mark this appointment as <b>Completed</b>?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenDialog(false)} sx={{ color: TEXT_MID, fontWeight: 600 }}>Cancel</Button>
              <Button onClick={handleConfirmComplete} variant="contained" sx={{ bgcolor: "#22c55e", color: "white", borderRadius: 50, px: 3, "&:hover": { bgcolor: "#16a34a" } }}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </>
  );
}
