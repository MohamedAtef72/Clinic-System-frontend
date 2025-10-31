import React, { useEffect, useState, useMemo } from "react";
// Your services
import {
  getAllApointments,
  getDoctorById,
  getPatientById,
  getDoctorAvailabilityById,
  updateAppointment,
  createVisit,
} from "../../../services/authService";
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
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
// Our New Components
import { AppointmentCard } from "../../../components/MobileAppointmentCard";
import { AppointmentsTable } from "../../../components/AppointmentTable"; 
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";

export default function ReceptionistAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Mobile menu states
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAppointment, setMenuAppointment] = useState(null);

  // --- DATA FETCHING (Unchanged, but now supports the new UI) ---
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const allAppointmentsRes = await getAllApointments(statusFilter,page);
      const appointmentsData = allAppointmentsRes.data || [];
      setTotalCount(allAppointmentsRes.totalCount || 0);
      setPageSize(allAppointmentsRes.pageSize || 5);

      const detailedAppointments = await Promise.all(
        appointmentsData.map(async (a) => {
          try {
            const [doctorRes, patientRes, availabilityRes] = await Promise.all([
              getDoctorById(a.doctorId),
              getPatientById(a.patientId),
              getDoctorAvailabilityById(a.availabilityId),
            ]);
            const doctorData = doctorRes?.data || doctorRes;
            const patientData = patientRes?.data || patientRes;
            const availabilityData = availabilityRes?.data || availabilityRes;
            return {
              ...a,
              doctorPrice: doctorData?.consulationPrice || 0,
              doctorName: doctorData?.userName || "N/A",
              patientName: patientData?.userName || "N/A",
              startTime: availabilityData?.startTime,
              endTime: availabilityData?.endTime,
            };
          } catch (err) {
            console.error(`Error fetching details for appointment ${a.id}:`, err);
            return { ...a, doctorName: "Error", patientName: "Error" };
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

  // --- HANDLERS ---
  const handlePageChange = (event, value) => setPage(value);
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
      await updateAppointment(selectedAppointment.id, {
        appointmentStatus: selectedAction,
      });
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
      case "CheckedIn":
        return "Mark this appointment as Checked-In and create a new Visit?";
      case "Cancelled":
        return "Are you sure you want to cancel this appointment?";
      case "NoShow":
        return "Confirm marking this appointment as a No-Show?";
      case "Completed":
        return "Mark this appointment as Completed?";
      default:
        return "Are you sure?";
    }
  }, [selectedAction]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // --- RENDER LOGIC ---
  if (loading && !appointments.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
      <Typography variant="h4" fontWeight="700" mb={4} textAlign="center">
        Manage Appointments
      </Typography>

      {/* Filter Section */}
      <AppointmentsFilterSection
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onApply={handleApplyFilter}
      />      

      {appointments.length === 0 && !loading ? (
        <Alert severity="info">No appointments found.</Alert>
      ) : isTabletOrMobile ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {appointments.map((a) => (
            <AppointmentCard key={a.id} appointment={a} onMenuOpen={handleMenuOpen} />
          ))}
        </Box>
      ) : (
        <AppointmentsTable appointments={appointments} onAction={handleOpenDialog} />
      )}

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: "flex", justifyContent: "center", mt: 4 }}
        />
      )}

      {/* Mobile Actions Menu (re-uses logic from TableActions) */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {['CheckedIn', 'Completed', 'Cancelled', 'NoShow'].map(action => (
          <MenuItem
            key={action}
            onClick={() => handleOpenDialog(menuAppointment, action)}
            disabled={menuAppointment?.appointmentStatus === action}
          >
            {action.replace(/([A-Z])/g, ' $1').trim()}
          </MenuItem>
        ))}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600}>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}