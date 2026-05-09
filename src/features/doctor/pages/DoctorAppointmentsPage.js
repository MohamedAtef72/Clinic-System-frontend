import React, { useEffect, useState } from "react";
import { getDoctorAppointments } from '../../../services/appointmentService';
import { getPatientById } from '../../../services/patientService';
import { getDoctorAvailabilityById } from '../../../services/availabilityService';
import { getVisitById, updateVisit } from '../../../services/visitService';
import { getRateByAppointmentId } from '../../../services/ratingService';
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert, Pagination, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, Stack, useTheme, useMediaQuery, Paper, Container, Grid, Drawer, IconButton } from "@mui/material";
import BreadcrumbHeader from '../../../components/BreadcrumbHeader';
import { DoctorAppointmentCard } from "../components/DoctorAppointmentCard";
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewRatingDialog from "../../../components/ViewRatingDialog";
import { updateAppointment } from '../../../services/appointmentService';

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
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

  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [visitDetails, setVisitDetails] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [editMedicine, setEditMedicine] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeVisitId, setActiveVisitId] = useState(null);
  const [activeAppointmentId, setActiveAppointmentId] = useState(null);
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
  const [ratingAppointmentId, setRatingAppointmentId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await getDoctorAppointments(statusFilter, user.id, pageNumber);
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
                patientName: patientRes?.data?.userName || patientRes?.data?.UserName || "N/A",
                patientCountry: patientRes?.data?.country || patientRes?.data?.Country || "N/A",
                patientBloodType: patientRes?.data?.bloodType || patientRes?.data?.BloodType || "N/A",
                startTime: availabilityRes?.Data?.StartTime ?? availabilityRes?.data?.startTime,
              };
            } catch (err) {
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

  const handlePageChange = (event, value) => setPageNumber(value);
  const handleApplyFilter = () => setPageNumber(1);
  const handleAddNotes = (visitId, appointmentId) => {
    setActiveVisitId(visitId);
    setActiveAppointmentId(appointmentId);
    handleUpdateVisit(visitId);
  };
  const handleCloseNotesDialog = () => {
    setNotesDialogOpen(false);
    setActiveVisitId(null);
    setActiveAppointmentId(null);
  };

  const handleShowNotes = async (visitId) => {
    if (!visitId) return;
    setIsEditMode(false);
    setNotesDialogOpen(true);
    setNotesLoading(true);
    try {
      const res = await getVisitById(visitId);
      setVisitDetails(res.data || null);
    } catch (error) {
      setVisitDetails(null);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleUpdateVisit = async (visitId) => {
    if (!visitId) return;
    setIsEditMode(true);
    setNotesDialogOpen(true);
    setNotesLoading(true);
    try {
      const res = await getVisitById(visitId);
      setVisitDetails(res.data || null);
      setEditNotes(res.data?.doctorNotes || "");
      setEditMedicine(res.data?.medicine || "");
    } catch (error) {
      setVisitDetails(null);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleSaveVisitUpdate = async () => {
    setIsUpdating(true);
    try {
      const newVisitData = {
        ...visitDetails,
        doctorNotes: editNotes,
        medicine: editMedicine,
        visitStatus: "Completed",
      };
      await updateVisit(visitDetails.id, newVisitData);

      if (activeAppointmentId) {
        setConfirmCompleteOpen(true);
      } else {
        setNotesDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to update visit details:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmFinalComplete = async () => {
    try {
      setIsUpdating(true);
      await updateAppointment(activeAppointmentId, { appointmentStatus: "Completed" });

      // Refresh list
      const res = await getDoctorAppointments(statusFilter, user.id, pageNumber);
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
              patientCountry: patientRes?.data?.country || "N/A",
              patientBloodType: patientRes?.data?.bloodType || "N/A",
              startTime: availabilityRes?.Data?.StartTime ?? availabilityRes?.data?.startTime,
            };
          } catch (err) { return { ...a, patientName: "Error" }; }
        })
      );
      setAppointments(detailedAppointments);

      setConfirmCompleteOpen(false);
      setNotesDialogOpen(false);
      setActiveAppointmentId(null);
      setActiveVisitId(null);
    } catch (error) {
      console.error("Error completing appointment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShowRate = (appointmentId) => {
    setRatingAppointmentId(appointmentId);
  };
  if (loading && appointments.length === 0) {
    return (<Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress sx={{ color: GOLD }} /></Box>);
  }

  const totalPages = Math.ceil(totalCount / 5);

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
            <Grid container spacing={4} sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>

              {/* Left Side: Filter (Hidden on mobile) */}
              <Grid item sx={{ width: "300px", flexShrink: 0, display: { xs: "none", md: "block" } }}>
                <Box sx={{ position: "sticky", top: 100 }}>
                  <AppointmentsFilterSection status={statusFilter} onStatusChange={setStatusFilter} forceCard={true} />
                </Box>
              </Grid>

              {/* Right Side: Appointments Grid */}
              <Grid item xs sx={{ minWidth: 0 }}>
                {appointments.length === 0 && !loading ? (
                  <Box sx={{ textAlign: "center", py: 8, borderRadius: 4, border: "1px dashed rgba(184,151,42,0.3)", bgcolor: GOLD_BG }}>
                    <CalendarMonthIcon sx={{ fontSize: 48, color: `${GOLD}66`, mb: 1.5 }} />
                    <Typography sx={{ color: TEXT_MID, fontWeight: 500 }}>You have no appointments scheduled.</Typography>
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={3} justifyContent="center">
                      {appointments.map((a) => (
                        <Grid item key={a.id}>
                          <DoctorAppointmentCard appointment={a} onAddNotes={handleAddNotes} onUpdateVisit={handleUpdateVisit} onShowNotes={handleShowNotes} onShowRate={handleShowRate} />
                        </Grid>
                      ))}
                    </Grid>

                    {totalPages > 1 && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                        <Pagination
                          count={totalPages} page={pageNumber} onChange={handlePageChange}
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

          {/* Visit Details Dialog */}
          <Dialog open={notesDialogOpen} onClose={handleCloseNotesDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, border: `1px solid ${GOLD}20` } }}>
            <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", color: TEXT_DARK, borderBottom: `1px solid ${GOLD}15`, bgcolor: GOLD_BG, py: 2 }}>
              {isEditMode ? "Update Visit Notes" : "Visit Notes"}
            </DialogTitle>
            <DialogContent sx={{ py: 3, pt: "24px !important" }}>
              {notesLoading ? (
                <Box display="flex" justifyContent="center" py={4}><CircularProgress sx={{ color: GOLD }} /></Box>
              ) : visitDetails ? (
                <Stack spacing={3}>
                  {isEditMode && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, p: 2, bgcolor: GOLD_BG, borderRadius: 2, border: `1px solid ${GOLD}40` }}>
                      <Typography sx={{ color: TEXT_DARK, fontWeight: 700 }}>Consultation Status</Typography>
                      <Typography sx={{ color: GOLD_DARK, fontWeight: 800, fontSize: "1.1rem" }}>{visitDetails.price} EGP</Typography>
                    </Box>
                  )}
                  <TextField
                    label="Doctor Notes" multiline rows={4}
                    value={isEditMode ? editNotes : visitDetails.doctorNotes || 'No notes provided.'}
                    onChange={isEditMode ? (e) => setEditNotes(e.target.value) : undefined}
                    InputProps={{ readOnly: !isEditMode }}
                    sx={{ "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: GOLD, borderWidth: "2px" }, "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK } }}
                  />
                  <TextField
                    label="Prescribed Medicine" multiline rows={4}
                    value={isEditMode ? editMedicine : visitDetails.medicine || 'No medicine prescribed.'}
                    onChange={isEditMode ? (e) => setEditMedicine(e.target.value) : undefined}
                    InputProps={{ readOnly: !isEditMode }}
                    sx={{ "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: GOLD, borderWidth: "2px" }, "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK } }}
                  />
                </Stack>
              ) : (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>No visit details are available for this appointment.</Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 1, display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleCloseNotesDialog} sx={{ color: TEXT_MID, fontWeight: 600 }}>Close</Button>
              {isEditMode && visitDetails && (
                <Button
                  onClick={handleSaveVisitUpdate}
                  variant="contained"
                  disabled={isUpdating}
                  sx={{ bgcolor: GOLD, color: "white", borderRadius: 50, px: 3, "&:hover": { bgcolor: GOLD_DARK } }}
                >
                  {isUpdating ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Save Changes"}
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Final Completion Confirmation Dialog */}
          <Dialog open={confirmCompleteOpen} onClose={() => setConfirmCompleteOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700, bgcolor: GOLD_BG, borderBottom: `1px solid ${GOLD}20` }}>Appointment Completed</DialogTitle>
            <DialogContent sx={{ pt: "24px !important" }}>
              <Typography sx={{ color: TEXT_MID }}>
                Notes and medicine saved successfully.<br /><br />
                Do you want to finalize and mark this appointment as <b>Completed</b>?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setConfirmCompleteOpen(false)} sx={{ color: TEXT_MID, fontWeight: 600 }}>Cancel</Button>
              <Button
                onClick={handleConfirmFinalComplete}
                disabled={isUpdating}
                variant="contained"
                sx={{ bgcolor: "#22c55e", color: "white", borderRadius: 50, px: 3, "&:hover": { bgcolor: "#16a34a" } }}
              >
                {isUpdating ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Confirm"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* View Rating Dialog */}
          <ViewRatingDialog
            open={!!ratingAppointmentId}
            onClose={() => setRatingAppointmentId(null)}
            appointmentId={ratingAppointmentId}
          />

        </Container>
      </Box>
    </>
  );
}