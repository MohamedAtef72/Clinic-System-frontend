import React, { useEffect, useState } from "react";
import { getAllAppointments } from '../../../services/appointmentService';
import { getDoctorById } from '../../../services/doctorService';
import { getPatientById } from '../../../services/patientService';
import { getDoctorAvailabilityById } from '../../../services/availabilityService';
import {
  Box, Typography, CircularProgress, Pagination,
  Grid, Container, useTheme, useMediaQuery
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BreadcrumbHeader from '../../../components/BreadcrumbHeader';
import { AppointmentReviewCard } from "../components/MobileAppointmentReviewCard";
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";
import ViewRatingDialog from "../../../components/ViewRatingDialog";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_MID } from "../../../theme/tokens";
/* ── Tokens ── */
export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [ratingAppointmentId, setRatingAppointmentId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAllAppointments(statusFilter, page);
      const appointmentsData = res.data || res.Data || [];
      setTotalCount(res.totalCount || res.TotalCount || 0);
      setPageSize(res.pageSize || res.PageSize || 5);

      const detailed = await Promise.all(
        appointmentsData.map(async (a) => {
          try {
            const [doctorRes, patientRes, availabilityRes] = await Promise.all([
              getDoctorById(a.doctorId),
              getPatientById(a.patientId),
              getDoctorAvailabilityById(a.availabilityId),
            ]);
            const doctorData = doctorRes?.data || doctorRes;
            const patientData = patientRes?.data || patientRes;
            const availabilityData = availabilityRes?.Data ?? availabilityRes?.data ?? {};

            return {
              ...a,
              id: a.id || a.Id,
              doctorName: doctorData?.userName || doctorData?.UserName || "N/A",
              patientName: patientData?.userName || patientData?.UserName || "N/A",
              patientCountry: patientData?.country || patientData?.Country || "N/A",
              doctorCountry: doctorData?.country || doctorData?.Country || "N/A",
              startTime: availabilityData?.StartTime ?? availabilityData?.startTime,
              endTime: availabilityData?.EndTime ?? availabilityData?.endTime,
            };
          } catch (err) {
            return { ...a, doctorName: "Error", patientName: "Error" };
          }
        })
      );
      setAppointments(detailed);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, statusFilter]);

  const handleApplyFilter = () => setPage(1);
  const handleShowRate = (appointmentId) => setRatingAppointmentId(appointmentId);

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
        <Container maxWidth={false} sx={{ px: { xs: 2.5, md: 5, lg: 8 } }}>

          <BreadcrumbHeader currentPage="All Appointments">
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <AppointmentsFilterSection status={statusFilter} onStatusChange={setStatusFilter} onApply={handleApplyFilter} />
            </Box>
          </BreadcrumbHeader>

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
                          <AppointmentReviewCard
                            appointment={a}
                            onShowRate={handleShowRate}
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
        </Container>

        <ViewRatingDialog
          open={!!ratingAppointmentId}
          onClose={() => setRatingAppointmentId(null)}
          appointmentId={ratingAppointmentId}
        />
      </Box>
    </>
  );
}
