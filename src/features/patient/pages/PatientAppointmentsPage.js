import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Box, Typography, CircularProgress, Alert, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Stack, useTheme, useMediaQuery, Container, Grid, Drawer, IconButton, Skeleton } from "@mui/material";
import { PatientAppointmentCard } from "../components/PatientAppointmentCard";
import AppointmentCardSkeleton from "../../appointments/components/skeletons/AppointmentCardSkeleton";
import BreadcrumbHeader from '../../../components/BreadcrumbHeader';
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";
import { useDetailedPatientAppointments } from "../../../features/appointments/hooks/useAppointments";
import { useVisitDetails } from "../../../features/appointments/hooks/useVisits";
import { useRateDoctor, useUpdateRate } from "../../../features/doctor/hooks/useDoctors";
import { getRateByAppointmentId } from "../../../services/ratingService";
import { GOLD, GOLD_BG, GOLD_DARK, TEXT_MID } from "../../../theme/tokens";
export default function PatientAppointmentsPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { user } = useAuth();

  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [activeVisitId, setActiveVisitId] = useState(null);

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [hasExistingRating, setHasExistingRating] = useState(false);

  const { data: appointmentsRes, isLoading: loadingDocs } = useDetailedPatientAppointments(user?.id, statusFilter, pageNumber);
  const rateDoctorMutation = useRateDoctor();
  const updateRateMutation = useUpdateRate();

  // Conditionally fetch visit details when notes dialog is open
  const { data: visitDetailsData, isLoading: visitLoading } = useVisitDetails(activeVisitId, visitDialogOpen);
  const [visitDetails, setVisitDetails] = useState(null);

  useEffect(() => {
    if (visitDetailsData) {
      setVisitDetails(visitDetailsData);
    }
  }, [visitDetailsData]);

  const appointments = appointmentsRes?.data || [];
  const totalCount = appointmentsRes?.totalCount || 0;
  const loading = loadingDocs;

  const handlePageChange = (event, value) => setPageNumber(value);
  const handleApplyFilter = () => setPageNumber(1);
  const handleCloseVisitDialog = () => setVisitDialogOpen(false);
  const handleCloseRatingDialog = () => setRatingDialogOpen(false);

  const handleShowNotes = (visitId) => {
    if (!visitId) return;
    setActiveVisitId(visitId);
    setVisitDialogOpen(true);
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
    try {
      if (!hasExistingRating) {
        await rateDoctorMutation.mutateAsync({
          appointmentId: selectedAppointmentId, doctorId: selectedDoctor.id, patientId: user.id, rate: ratingValue, comment,
        });
        setRatingSuccess(true);
      } else if (selectedRateId) {
        await updateRateMutation.mutateAsync({ id: selectedRateId, ratingData: { rate: ratingValue, comment: comment } });
        setRatingSuccess(true);
      }
    } catch (err) { }
  };

  const dialogInputSx = {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: GOLD, borderWidth: "2px" },
    "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK },
  };

  return (
    <>
<Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", py: { xs: 5, md: 5 }, pb: 8, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="xl">

          <BreadcrumbHeader currentPage="My Appointments">
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <AppointmentsFilterSection status={statusFilter} onStatusChange={setStatusFilter} />
            </Box>
          </BreadcrumbHeader>

          {/* Master Container for Filters and Cards */}
          <Box sx={{ mx: { xs: 0.7, sm: 1.5, md: 3, lg: 6 } }}>
            <Grid container spacing={2} sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>

              {/* Left Side: Filter (Hidden on mobile) */}
              <Grid item sx={{ width: "300px", flexShrink: 0, display: { xs: "none", md: "block" } }}>
                <Box sx={{ position: "sticky", top: 100 }}>
                  <AppointmentsFilterSection status={statusFilter} onStatusChange={setStatusFilter} forceCard={true} />
                </Box>
              </Grid>

              {/* Right Side: Appointments Grid */}
              <Grid item xs sx={{ minWidth: 0 }}>
                {loading ? (
                  <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Grid item key={i}>
                        <AppointmentCardSkeleton />
                      </Grid>
                    ))}
                  </Grid>
                ) : appointments.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 3 }}>You have no appointments matching this criteria.</Alert>
                ) : (
                  <>
                    <Grid container spacing={3}>
                      {appointments.map((a) => (
                        <Grid item key={a.id}>
                          <PatientAppointmentCard appointment={a} onShowNotes={handleShowNotes} onRateDoctor={() => handleOpenRating(a.doctor, a.id, a.hasRated, a.rateId)} />
                        </Grid>
                      ))}
                    </Grid>

                    {Math.ceil(totalCount / 5) > 1 && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                        <Pagination
                          count={Math.ceil(totalCount / 5)} page={pageNumber} onChange={handlePageChange}
                          sx={{
                            "& .MuiPaginationItem-root": {
                              borderRadius: 2, fontWeight: 600, fontSize: "0.9rem",
                              "&.Mui-selected": { bgcolor: GOLD, color: "white", "&:hover": { bgcolor: GOLD_DARK } },
                              "&:hover:not(.Mui-selected)": { bgcolor: "#fdf8ec", color: GOLD_DARK },
                            },
                          }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </Box>

          {/* Visit Dialog */}
          <Dialog open={visitDialogOpen} onClose={handleCloseVisitDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ fontWeight: 700, bgcolor: GOLD_BG, borderBottom: `1px solid ${GOLD}20` }}>Visit Details</DialogTitle>
            <DialogContent sx={{ pt: "24px !important" }}>
              {visitLoading ? (
                <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: GOLD }} /></Box>
              ) : visitDetails ? (
                <Stack spacing={3} sx={{ py: 2 }}>
                  <TextField label="Doctor Notes" multiline rows={4} value={visitDetails.doctorNotes || 'No notes provided.'} InputProps={{ readOnly: true }} sx={dialogInputSx} />
                  <TextField label="Prescribed Medicine" multiline rows={4} value={visitDetails.medicine || 'No medicine prescribed.'} InputProps={{ readOnly: true }} sx={dialogInputSx} />
                </Stack>
              ) : (
                <Alert severity="warning">No visit details are available for this appointment.</Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: `1px solid ${GOLD}20` }}>
              <Button onClick={handleCloseVisitDialog} sx={{ color: TEXT_MID, fontWeight: 600 }}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Rating Dialog */}
          <Dialog open={ratingDialogOpen} onClose={handleCloseRatingDialog} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ fontWeight: 700, bgcolor: GOLD_BG, borderBottom: `1px solid ${GOLD}20`, textAlign: "center" }}>
              Rate Dr. {selectedDoctor?.userName}
            </DialogTitle>
            <DialogContent sx={{ pt: "24px !important" }}>
              <Stack spacing={3} alignItems="center">
                {ratingLoading ? (
                  <Box py={5}><CircularProgress sx={{ color: GOLD }} /></Box>
                ) : ratingSuccess ? (
                  <Alert severity="success" sx={{ width: "100%", borderRadius: 2 }}>Thank you for your feedback!</Alert>
                ) : (
                  <>
                    <Rating name="doctor-rating" value={ratingValue} onChange={(e, val) => setRatingValue(val)} size="large" sx={{ color: GOLD, fontSize: "3rem" }} />
                    <TextField label="Comment (optional)" fullWidth multiline rows={3} value={comment} onChange={(e) => setComment(e.target.value)} sx={dialogInputSx} />
                  </>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: "space-between", borderTop: `1px solid ${GOLD}20` }}>
              <Button onClick={handleCloseRatingDialog} sx={{ color: TEXT_MID, fontWeight: 600 }}>Close</Button>
              {!ratingSuccess && (
                <Button onClick={handleConfirmRating} variant="contained" disabled={rateDoctorMutation.isPending || updateRateMutation.isPending || !ratingValue} sx={{ bgcolor: GOLD, color: "white", borderRadius: 50, px: 3, "&:hover": { bgcolor: GOLD_DARK } }}>
                  {rateDoctorMutation.isPending || updateRateMutation.isPending ? <CircularProgress size={20} sx={{ color: "white" }} /> : hasExistingRating ? "Update Rating" : "Submit Rating"}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
}
