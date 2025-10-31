import React, { useEffect, useState } from "react";
// Services
import {
  getAllApointments,
  getDoctorById,
  getPatientById,
  getDoctorAvailabilityById,
  getRateByAppointmentId,
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
  Rating,
  Stack,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
// New Custom Components
import { AppointmentReviewCard } from "../components/MobileAppointmentReviewCard";
import { AppointmentsReviewTable } from "../components/AppointmentsReviewTable";
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --- Rating Dialog States ---
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [selectedComment, setSelectedComment] = useState("");
  const [rateLoading, setRateLoading] = useState(false);

  // --- Fetch Appointments ---
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await getAllApointments(statusFilter, page);
        setTotalCount(res.totalCount || 0);
        setPageSize(res.pageSize || 5);

        const detailedAppointments = await Promise.all(
          (res.data || []).map(async (a) => {
            try {
              const [doctorRes, patientRes, availabilityRes] = await Promise.all([
                getDoctorById(a.doctorId),
                getPatientById(a.patientId),
                getDoctorAvailabilityById(a.availabilityId),
              ]);
              return {
                ...a,
                doctorName: doctorRes.userName || "N/A",
                patientName: patientRes?.data?.userName || "N/A",
                startTime: availabilityRes?.startTime,
                endTime: availabilityRes?.endTime,
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
    fetchAppointments();
  }, [page, statusFilter]);

  // --- Handlers ---
  const handlePageChange = (event, value) => setPage(value);
  const handleApplyFilter = () => setPage(1);

  const handleCloseDialog = () => setOpenDialog(false);

  const handleShowRate = async (appointmentId) => {
    setOpenDialog(true);
    setRateLoading(true);
    try {
      const res = await getRateByAppointmentId(appointmentId);
      setSelectedRate(res?.data?.rate || 0);
      setSelectedComment(res?.data?.comment || "No comment provided.");
    } catch (error) {
      console.error("Error fetching rate:", error);
      setSelectedRate(null);
      setSelectedComment("Could not load rating information.");
    } finally {
      setRateLoading(false);
    }
  };

  // --- Loading State ---
  if (loading && appointments.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  // --- RENDER ---
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1400px", mx: "auto" }}>
      <Typography variant="h4" fontWeight="700" mb={4} textAlign="center">
        All Appointments
      </Typography>

      {/* Filter Section */}
      <AppointmentsFilterSection
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onApply={handleApplyFilter}
      />

      {/* --- Appointment List --- */}
      {appointments.length === 0 && !loading ? (
        <Alert severity="info">No appointments found.</Alert>
      ) : isTabletOrMobile ? (
        <Box sx={{ display: "grid", gap: 2 }}>
          {appointments.map((a) => (
            <AppointmentReviewCard key={a.id} appointment={a} onShowRate={handleShowRate} />
          ))}
        </Box>
      ) : (
        <AppointmentsReviewTable appointments={appointments} onShowRate={handleShowRate} />
      )}

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: "flex", justifyContent: "center", mt: 4 }}
        />
      )}

      {/* --- Rating Dialog --- */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Appointment Rating</DialogTitle>
        <DialogContent dividers>
          {rateLoading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : selectedRate !== null ? (
            <Stack spacing={3} alignItems="center" py={2}>
              <Rating value={selectedRate} readOnly size="large" precision={0.5} />
              <Divider sx={{ width: "100%" }}>
                <Typography variant="caption" color="text.secondary">
                  Comment
                </Typography>
              </Divider>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50", width: "100%" }}>
                <Typography
                  sx={{
                    fontStyle: selectedComment === "No comment provided." ? "italic" : "normal",
                  }}
                >
                  {selectedComment}
                </Typography>
              </Paper>
            </Stack>
          ) : (
            <Alert severity="warning">No rating data available for this appointment.</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
