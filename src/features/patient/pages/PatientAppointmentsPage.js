import React, { useEffect, useState } from "react";
import { getPatientAppointments } from '../../../services/appointmentService';
import { getDoctorById } from '../../../services/doctorService';
import { getDoctorAvailabilityById } from '../../../services/availabilityService';
import { getVisitById } from '../../../services/visitService';
import { rateDoctor, updateDoctorRate, getRateByAppointmentId } from '../../../services/ratingService';
import { useAuth } from "../../../contexts/AuthContext";
import { Box, Typography, CircularProgress, Alert, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Stack, useTheme, useMediaQuery, Container, Grid, Drawer, IconButton } from "@mui/material";
import { PatientAppointmentCard } from "../components/PatientAppointmentCard";
import BreadcrumbHeader from '../../../components/BreadcrumbHeader';
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";


import { GOLD, GOLD_BG, GOLD_DARK, TEXT_MID } from "../../../theme/tokens";
export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const { user } = useAuth();

  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);
  const [visitLoading, setVisitLoading] = useState(false);

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [hasExistingRating, setHasExistingRating] = useState(false);

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
              const dData = doctorRes?.data || doctorRes;
              appointmentData.doctor = {
                ...dData,
                userName: dData?.userName || dData?.UserName || "N/A",
                country: dData?.country || dData?.Country || "N/A",
                specialityName: dData?.specialityName || dData?.SpecialityName || "N/A",
              };
              appointmentData.doctorPrice = dData?.consulationPrice || dData?.ConsulationPrice || 0;
            } catch (err) { }
            try {
              const availabilityRes = await getDoctorAvailabilityById(a.availabilityId);
              const avail = availabilityRes?.Data ?? availabilityRes?.data ?? {};
              appointmentData.startTime = avail.StartTime ?? avail.startTime;
              appointmentData.endTime = avail.EndTime ?? avail.endTime;
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
            } catch { }
            return appointmentData;
          })
        );
        setAppointments(detailedAppointments);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, pageNumber, statusFilter]);

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
        await rateDoctor({
          appointmentId: selectedAppointmentId, doctorId: selectedDoctor.id, patientId: user.id, rate: ratingValue, comment,
        });
        setRatingSuccess(true);
        setAppointments((prev) => prev.map((app) => app.id === selectedAppointmentId ? { ...app, hasRated: true } : app));
      } else if (selectedRateId) {
        await updateDoctorRate(selectedRateId, { rate: ratingValue, comment: comment });
        setRatingSuccess(true);
      }
    } catch (err) { } finally {
      setRatingLoading(false);
    }
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
                {loading && appointments.length === 0 ? (
                  <Box display="flex" justifyContent="center" alignItems="center" py={10}>
                    <CircularProgress sx={{ color: GOLD }} />
                  </Box>
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
                <Button onClick={handleConfirmRating} variant="contained" disabled={ratingLoading || !ratingValue} sx={{ bgcolor: GOLD, color: "white", borderRadius: 50, px: 3, "&:hover": { bgcolor: GOLD_DARK } }}>
                  {hasExistingRating ? "Update Rating" : "Submit Rating"}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
}
