import React, { useEffect, useState } from "react";
// Services & Context
import {
  getDoctorAppointments,
  getPatientById,
  getDoctorAvailabilityById,
  getVisitById,
  getRateByAppointmentId,
} from "../../../services/authService";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
// MUI Components
import {
  Box, Typography, CircularProgress, Alert, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Stack, useTheme, useMediaQuery, Paper
} from "@mui/material";
// New Custom Components
import { DoctorAppointmentCard } from "../components/DoctorAppointmentCard"; 
import { DoctorAppointmentsTable } from "../components/DoctorAppointmentTable";
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";


export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Dialog states
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [ratingDetails, setRatingDetails] = useState(null);
  const [rateLoading, setRateLoading] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await getDoctorAppointments(statusFilter,user.id, pageNumber);
        setTotalCount(res.totalCount || 0);
        const detailedAppointments = await Promise.all(
          (res.data || []).map(async (a) => {
            try {
              const [patientRes, availabilityRes] = await Promise.all([
                getPatientById(a.patientId),
                getDoctorAvailabilityById(a.availabilityId),
              ]);
              return {
                ...a,
                patientName: patientRes?.data?.userName || "N/A",
                startTime: availabilityRes.startTime,
              };
            } catch (err) {
              console.error(`Error fetching details for appointment ${a.id}:`, err);
              return { ...a, patientName: "Error" };
            }
          })
        );
        setAppointments(detailedAppointments);
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user, pageNumber, statusFilter]);

  // --- HANDLERS ---
  const handlePageChange = (event, value) => setPageNumber(value);
  const handleApplyFilter = () => setPageNumber(1);
  const handleAddNotes = (visitId, appointmentId) => navigate(`/doctor/visit/${visitId}?appointmentId=${appointmentId}`);
  const handleCloseNotesDialog = () => setNotesDialogOpen(false);
  const handleCloseRatingDialog = () => setRatingDialogOpen(false);

  const handleShowNotes = async (visitId) => {
    if (!visitId) return;
    setNotesDialogOpen(true);
    setNotesLoading(true);
    try {
      const res = await getVisitById(visitId);
      setVisitDetails(res.data || null);
    } catch (error) {
      console.error("Error fetching visit details:", error);
      setVisitDetails(null);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleShowRate = async (appointmentId) => {
    setRatingDialogOpen(true);
    setRateLoading(true);
    try {
      const res = await getRateByAppointmentId(appointmentId);
      setRatingDetails(res.data || null);
    } catch (error) {
      console.error("Error fetching rate:", error);
      setRatingDetails(null);
    } finally {
      setRateLoading(false);
    }
  };

  // --- RENDER LOGIC ---
  if (loading && appointments.length === 0) {
    return ( <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box> );
  }

  const totalPages = Math.ceil(totalCount / 5);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
      <Typography variant="h4" fontWeight="700" mb={4} textAlign="center">
        My Appointments
      </Typography>

      {/* Filter Section */}
      <AppointmentsFilterSection
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onApply={handleApplyFilter}
      />  

      {appointments.length === 0 && !loading ? (
        <Alert severity="info">You have no appointments scheduled.</Alert>
      ) : isTabletOrMobile ? (
        <Stack spacing={2}>
          {appointments.map((a) => (
            <DoctorAppointmentCard key={a.id} appointment={a} onAddNotes={handleAddNotes} onShowNotes={handleShowNotes} onShowRate={handleShowRate} />
          ))}
        </Stack>
      ) : (
        <DoctorAppointmentsTable appointments={appointments} onAddNotes={handleAddNotes} onShowNotes={handleShowNotes} onShowRate={handleShowRate} />
      )}

      {totalPages > 1 && (
        <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} color="primary" sx={{ display: "flex", justifyContent: "center", mt: 4 }} />
      )}

      {/* Visit Details Dialog */}
      <Dialog open={notesDialogOpen} onClose={handleCloseNotesDialog} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Visit Notes</DialogTitle>
        <DialogContent dividers>
          {notesLoading ? (
            <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
          ) : visitDetails ? (
            <Stack spacing={2} sx={{ py: 2 }}>
              <TextField label="Doctor Notes" multiline rows={4} value={visitDetails.doctorNotes || 'No notes provided.'} InputProps={{ readOnly: true }} />
              <TextField label="Prescribed Medicine" multiline rows={4} value={visitDetails.medicine || 'No medicine prescribed.'} InputProps={{ readOnly: true }} />
            </Stack>
          ) : (
            <Alert severity="warning">No visit details are available for this appointment.</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={handleCloseNotesDialog} variant="contained">Close</Button></DialogActions>
      </Dialog>

      {/* View Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={handleCloseRatingDialog} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Patient's Rating</DialogTitle>
        <DialogContent dividers>
          {rateLoading ? (
            <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
          ) : ratingDetails ? (
            <Stack spacing={2} alignItems="center" py={2}>
              <Rating value={ratingDetails.rate || 0} readOnly size="large" precision={0.5} />
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50", width: "100%", mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Patient Comment:</Typography>
                <Typography sx={{ fontStyle: !ratingDetails.comment ? "italic" : "normal" }}>
                  {ratingDetails.comment || "No comment provided."}
                </Typography>
              </Paper>
            </Stack>
          ) : (
            <Alert severity="info">The patient has not submitted a rating for this appointment yet.</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={handleCloseRatingDialog} variant="contained">Close</Button></DialogActions>
      </Dialog>
    </Box>
  );
}