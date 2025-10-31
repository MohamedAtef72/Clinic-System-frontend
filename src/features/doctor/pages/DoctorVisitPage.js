import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getVisitById, updateVisit, updateAppointment } from "../../../services/authService";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

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
      console.error("Error updating visit:", error);
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

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (!visit)
    return <Alert severity="error">Failed to load visit details.</Alert>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Edit Visit Notes
      </Typography>

      <Typography variant="subtitle1" mb={1}>
        <b>Price:</b> {visit.price} EGP
      </Typography>

      <TextField
        label="Doctor Notes"
        multiline
        rows={4}
        fullWidth
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TextField
        label="Medicine"
        multiline
        rows={2}
        fullWidth
        value={medicine}
        onChange={(e) => setMedicine(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>

      {/* ✅ Dialog Confirmation */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Mark Appointment as Completed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Notes and medicine saved successfully.  
            Do you want to mark this appointment as <b>Completed</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmComplete} color="success" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
