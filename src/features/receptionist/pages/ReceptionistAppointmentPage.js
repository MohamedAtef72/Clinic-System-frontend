import React, { useEffect, useState, useMemo } from "react";
import { getAllAppointments, updateAppointment } from '../../../services/appointmentService';
import { getDoctorById } from '../../../services/doctorService';
import { getPatientById } from '../../../services/patientService';
import { getDoctorAvailabilityById } from '../../../services/availabilityService';
import { createVisit } from '../../../services/visitService';
import {
  Box, Typography, CircularProgress, Alert, Pagination,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Menu, MenuItem, useTheme, useMediaQuery, Grid, Container, Breadcrumbs, Link
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { AppointmentReviewCard as AppointmentCard } from "../../appointments/components/MobileAppointmentReviewCard";
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";
import ViewRatingDialog from "../../../components/ViewRatingDialog";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
/* ── Tokens ── */
export default function ReceptionistAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [ratingAppointmentId, setRatingAppointmentId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAppointment, setMenuAppointment] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const allAppointmentsRes = await getAllAppointments(statusFilter, page);
      const rawData = allAppointmentsRes.data || allAppointmentsRes.Data || [];
      setTotalCount(allAppointmentsRes.totalCount || allAppointmentsRes.TotalCount || 0);
      setPageSize(allAppointmentsRes.pageSize || allAppointmentsRes.PageSize || 5);

      const detailedAppointments = await Promise.all(
        rawData.map(async (a) => {
          // Normalize appointment fields
          const appt = {
            id: a.id || a.Id,
            doctorId: a.doctorId || a.DoctorId,
            patientId: a.patientId || a.PatientId,
            availabilityId: a.availabilityId || a.AvailabilityId,
            appointmentStatus: a.appointmentStatus || a.AppointmentStatus,
            ...a
          };

          try {
            const [doctorRes, patientRes, availabilityRes] = await Promise.all([
              getDoctorById(appt.doctorId),
              getPatientById(appt.patientId),
              getDoctorAvailabilityById(appt.availabilityId),
            ]);

            const doctorData = doctorRes?.data || doctorRes;
            const patientData = patientRes?.data || patientRes;
            const availabilityData = availabilityRes?.Data || availabilityRes.data;

            return {
              ...appt,
              doctorPrice: doctorData?.consulationPrice || doctorData?.ConsulationPrice || 0,
              doctorName: doctorData?.userName || doctorData?.UserName || "N/A",
              patientName: patientData?.userName || patientData?.UserName || "N/A",
              startTime: availabilityData?.startTime || availabilityData?.StartTime,
              endTime: availabilityData?.endTime || availabilityData?.EndTime,
              patientCountry: patientData?.country || patientData?.Country || "N/A",
              doctorCountry: doctorData?.country || doctorData?.Country || "N/A",
            };
          } catch (err) {
            return { ...appt, doctorName: "Error", patientName: "Error" };
          }
        })
      );
      setAppointments(detailedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, statusFilter]);

  const handleApplyFilter = () => setPage(1);

  const handleMenuOpen = (event, appointment) => {
    setAnchorEl(event.currentTarget);
    setMenuAppointment(appointment);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenDialog = (appointment, action) => {
    setSelectedAppointment(appointment);
    setSelectedAction(action);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    if (actionLoading) return;
    setOpenDialog(false);
  };

  const handleConfirmAction = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      await updateAppointment(selectedAppointment.id, { appointmentStatus: selectedAction });
      if (selectedAction === "CheckedIn") {
        await createVisit({
          appointmentId: selectedAppointment.id,
          price: selectedAppointment.doctorPrice,
          visitStatus: "CheckedIn",
          doctorNotes: "",
          medicine: "",
        });
      }
      handleCloseDialog();
      fetchAppointments();
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const dialogMessage = useMemo(() => {
    switch (selectedAction) {
      case "CheckedIn": return "Mark this appointment as Checked-In and create a new Visit?";
      case "Cancelled": return "Are you sure you want to cancel this appointment?";
      case "NoShow": return "Confirm marking this appointment as a No-Show?";
      case "Completed": return "Mark this appointment as Completed?";
      default: return "Are you sure?";
    }
  }, [selectedAction]);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading && !appointments.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: GOLD }} />
      </Box>
    );
  }

  return (
    <>
<Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", py: { xs: 5, md: 5 }, pb: 8, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="xl">

          {/* Top Bar Container */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, bgcolor: GOLD_BG, borderRadius: 3, border: `1px solid rgba(184,151,42,0.15)`, py: 2, px: { xs: 2, sm: 4, md: 5 }, mb: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: TEXT_MID }} />}>
                <Link
                  underline="hover" color="inherit" href="/"
                  sx={{ display: 'flex', alignItems: 'center', color: TEXT_MID, fontSize: "0.95rem", fontWeight: 600, "&:hover": { color: GOLD } }}
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Home
                </Link>
                <Typography sx={{ color: GOLD_DARK, fontWeight: 800, fontSize: "0.95rem" }}>
                  Receptionist Appointments
                </Typography>
              </Breadcrumbs>
            </Box>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <AppointmentsFilterSection status={statusFilter} onStatusChange={setStatusFilter} onApply={handleApplyFilter} />
            </Box>
          </Box>

          {/* Master Container for Filters and Cards */}
          <Box sx={{ mx: { xs: 0.7, sm: 1.5, md: 3, lg: 6 } }}>
            <Grid container spacing={4} sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>

              {/* Left Side: Filter (Hidden on mobile) */}
              <Grid item sx={{ width: "300px", flexShrink: 0, display: { xs: "none", md: "block" } }}>
                <Box sx={{ position: "sticky", top: 100 }}>
                  <AppointmentsFilterSection status={statusFilter} onStatusChange={setStatusFilter} onApply={handleApplyFilter} forceCard={true} />
                </Box>
              </Grid>

              {/* Right Side: Appointments Grid */}
              <Grid item xs sx={{ minWidth: 0 }}>
                {appointments.length === 0 && !loading ? (
                  <Box sx={{ textAlign: "center", py: 8, borderRadius: 4, border: "1px dashed rgba(184,151,42,0.3)", bgcolor: GOLD_BG }}>
                    <CalendarMonthIcon sx={{ fontSize: 48, color: `${GOLD}66`, mb: 1.5 }} />
                    <Typography sx={{ color: TEXT_MID, fontWeight: 500 }}>No appointments found.</Typography>
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={3}>
                      {appointments.map((a) => (
                        <Grid item xs={12} sm={6} lg={4} xl={4} key={a.id}>
                          <AppointmentCard
                            appointment={a}
                            onShowRate={(id) => setRatingAppointmentId(id)}
                            onMenuOpen={handleMenuOpen}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    {totalPages > 1 && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                        <Pagination
                          count={totalPages} page={page} onChange={(_, v) => setPage(v)}
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


          <Menu
            anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1, minWidth: 180, borderRadius: 3,
                border: `1px solid ${GOLD}25`,
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                p: 1
              }
            }}
          >
            <Box sx={{ px: 2, py: 1, mb: 1, borderBottom: `1px dashed ${GOLD}30` }}>
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, color: TEXT_MID, textTransform: "uppercase", letterSpacing: 1 }}>Update Status</Typography>
            </Box>

            {[
              { id: 'CheckedIn', label: 'Checked In', color: '#10b981' },
              { id: 'Completed', label: 'Completed', color: GOLD },
              { id: 'Cancelled', label: 'Cancelled', color: '#ef4444' },
            ].map(action => {
              const isDisabled = menuAppointment?.appointmentStatus === action.id;

              return (
                <MenuItem
                  key={action.id}
                  onClick={() => handleOpenDialog(menuAppointment, action.id)}
                  disabled={isDisabled}
                  sx={{
                    borderRadius: 2, mb: 0.5, py: 1.2, px: 2,
                    display: "flex", alignItems: "center", gap: 1.5,
                    "&:hover": { bgcolor: GOLD_BG, "& .label": { color: GOLD_DARK, fontWeight: 700 } },
                    opacity: isDisabled ? 0.5 : 1
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: action.color }} />
                  <Typography className="label" sx={{ fontSize: "0.88rem", fontWeight: isDisabled ? 700 : 500, color: TEXT_DARK, transition: "0.2s" }}>
                    {action.label}
                  </Typography>
                  {isDisabled && (
                    <Typography sx={{ ml: "auto", fontSize: "0.65rem", color: TEXT_MID, fontWeight: 700 }}>CURRENT</Typography>
                  )}
                </MenuItem>
              );
            })}
          </Menu>

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, border: `1px solid ${GOLD}20` } }}>
            <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", color: TEXT_DARK, borderBottom: `1px solid ${GOLD}15`, bgcolor: GOLD_BG, py: 2 }}>Confirm Action</DialogTitle>
            <DialogContent sx={{ py: 3, pt: "24px !important" }}>
              <Typography sx={{ color: TEXT_MID, fontSize: "0.95rem" }}>{dialogMessage}</Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 1 }}>
              <Button onClick={handleCloseDialog} sx={{ color: TEXT_MID, fontWeight: 600, textTransform: "none" }}>Cancel</Button>
              <Button
                onClick={handleConfirmAction} variant="contained" disabled={actionLoading}
                sx={{ borderRadius: 50, px: 3, bgcolor: GOLD, "&:hover": { bgcolor: GOLD_DARK }, textTransform: "none", fontWeight: 600 }}
              >
                {actionLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Confirm"}
              </Button>
            </DialogActions>
          </Dialog>

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