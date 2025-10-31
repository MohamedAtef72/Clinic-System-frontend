import React, { useEffect, useState } from "react";
// Services & Context
import {
  getPatientAppointments,
  getDoctorById,
  getDoctorAvailabilityById,
  getVisitById,
  rateDoctor,
  updateDoctorRate,
  getRateByAppointmentId,
} from "../../../services/authService";
import { useAuth } from "../../../contexts/AuthContext";
// MUI Components
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
// New Custom Component
import { PatientAppointmentCard } from "../components/PatientAppointmentCard";
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Visit Dialog State
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);
  const [visitLoading, setVisitLoading] = useState(false);

  // Rating Dialog State
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [hasExistingRating, setHasExistingRating] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await getPatientAppointments(statusFilter, user.id, pageNumber);
        setTotalCount(res.totalCount || 0);

        const detailedAppointments = await Promise.all(
          (res.data || []).map(async (a) => {
            const appointmentData = { ...a, doctor: {}, hasRated: false, rateId: null };

            try {
              const doctorRes = await getDoctorById(a.doctorId);
              appointmentData.doctor = doctorRes;
              appointmentData.doctorPrice = doctorRes.consulationPrice;
            } catch (err) {
              console.error(`Error fetching doctor for appointment ${a.id}:`, err);
            }

            try {
              const availabilityRes = await getDoctorAvailabilityById(a.availabilityId);
              appointmentData.startTime = availabilityRes.startTime;
              appointmentData.endTime = availabilityRes.endTime;
            } catch (err) {
              appointmentData.startTime = a.startTime || a.appointmentDate;
              appointmentData.endTime = a.endTime;
            }

            try {
              if (a.appointmentStatus === "Completed") {
                const ratingRes = await getRateByAppointmentId(a.id);
                if (ratingRes?.data) {
                  appointmentData.hasRated = true;
                  appointmentData.rateId = ratingRes.data.id; 
                }
              }
            } catch {
              appointmentData.hasRated = false;
            }

            return appointmentData;
          })
        );

        setAppointments(detailedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, pageNumber, statusFilter]);

  // --- HANDLERS ---
  const handlePageChange = (event, value) => setPageNumber(value);
  const handleApplyFilter = () => setPageNumber(1);
  const handleCloseVisitDialog = () => setVisitDialogOpen(false);
  const handleCloseRatingDialog = () => setRatingDialogOpen(false);

  const handleShowNotes = async (visitId) => {
    if (!visitId) return;
    setVisitDialogOpen(true);
    setVisitLoading(true);
    try {
      const res = await getVisitById(visitId);
      setVisitDetails(res.data || null);
    } catch (error) {
      console.error("Error fetching visit details:", error);
      setVisitDetails(null);
    } finally {
      setVisitLoading(false);
    }
  };

  const handleOpenRating = (doctor, appointmentId, hasRated, rateId) => {
    setSelectedDoctor(doctor);
    setSelectedAppointmentId(appointmentId);
    setHasExistingRating(hasRated);
    setSelectedRateId(rateId || null);
    setRatingValue(0);
    setComment("");
    setRatingSuccess(false);
    setRatingDialogOpen(true);

    if (hasRated && rateId) {
      setRatingLoading(true);
      getRateByAppointmentId(appointmentId)
        .then((res) => {
          setRatingValue(res.data.rate || 0);
          setComment(res.data.comment || "");
        })
        .finally(() => setRatingLoading(false));
    }
  };

  const handleConfirmRating = async () => {
    if (!selectedDoctor || !selectedAppointmentId) return;
    setRatingLoading(true);
    try {
      if (!hasExistingRating) {
        // Add new rating
        await rateDoctor({
          appointmentId: selectedAppointmentId,
          doctorId: selectedDoctor.id,
          patientId: user.id,
          rate: ratingValue,
          comment,
        });
        setRatingSuccess(true);
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === selectedAppointmentId
              ? { ...app, hasRated: true }
              : app
          )
        );
      } else if (selectedRateId) {
        // Update existing rating using rateId
        await updateDoctorRate(selectedRateId, {
          rate: ratingValue,
          comment: comment,
        });
        setRatingSuccess(true);
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    } finally {
      setRatingLoading(false);
    }
  };

  // --- RENDER ---
  if (loading && appointments.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalPages = Math.ceil(totalCount / 5);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "900px", mx: "auto" }}>
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
        <Alert severity="info">You have no appointments</Alert>
      ) : (
        <Stack spacing={3}>
          {appointments.map((a) => (
            <PatientAppointmentCard
              key={a.id}
              appointment={a}
              onShowNotes={handleShowNotes}
              onRateDoctor={() =>
                handleOpenRating(a.doctor, a.id, a.hasRated, a.rateId)
              }
            />
          ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={pageNumber}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: "flex", justifyContent: "center", mt: 4 }}
        />
      )}

      {/* Visit Dialog */}
      <Dialog open={visitDialogOpen} onClose={handleCloseVisitDialog} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Visit Details</DialogTitle>
        <DialogContent dividers>
          {visitLoading ? (
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
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseVisitDialog} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={handleCloseRatingDialog} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600} textAlign="center">
          Rate Dr. {selectedDoctor?.userName}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ pt: 1 }}>
            {ratingLoading ? (
              <CircularProgress />
            ) : ratingSuccess ? (
              <Alert severity="success" sx={{ width: "100%" }}>
                Thank you for your feedback!
              </Alert>
            ) : (
              <>
                <Rating name="doctor-rating" value={ratingValue} onChange={(e, val) => setRatingValue(val)} size="large" />
                <TextField label="Comment (optional)" fullWidth multiline rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button onClick={handleCloseRatingDialog}>Cancel</Button>
          {!ratingSuccess && (
            <Button
              onClick={handleConfirmRating}
              variant="contained"
              disabled={ratingLoading || !ratingValue}
            >
              {hasExistingRating ? "Update Rating" : "Submit Rating"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
