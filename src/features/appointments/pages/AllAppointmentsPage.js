import React, { useState } from "react";
import {
  Box, Typography, Pagination, Grid, Container, Fade, Alert
} from "@mui/material";
import { useDetailedAllAppointments } from "../hooks/useAppointments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BreadcrumbHeader from '../../../components/BreadcrumbHeader';
import { AppointmentReviewCard } from "../components/MobileAppointmentReviewCard";
import AppointmentReviewCardSkeleton from "../components/skeletons/AppointmentReviewCardSkeleton";
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";
import ViewRatingDialog from "../../../components/ViewRatingDialog";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_MID } from "../../../theme/tokens";

export default function AllAppointmentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingAppointmentId, setRatingAppointmentId] = useState(null);

  const { data: appointmentsRes, isLoading: loading, error } = useDetailedAllAppointments(statusFilter, page);

  const appointments = appointmentsRes?.data || [];
  const totalCount = appointmentsRes?.totalCount || 0;
  const pageSize = appointmentsRes?.pageSize || 5;

  const handleApplyFilter = () => setPage(1);
  const handleShowRate = (appointmentId) => setRatingAppointmentId(appointmentId);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f5f7", py: { xs: 4, md: 5 }, pb: 8, fontFamily: "'Inter', sans-serif" }}>
      <Container maxWidth={false} sx={{ px: { xs: 2.5, md: 5, lg: 8 } }}>
        <BreadcrumbHeader currentPage="All Appointments">
          <Box sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
            <AppointmentsFilterSection status={statusFilter} onStatusChange={setStatusFilter} onApply={handleApplyFilter} />
          </Box>
        </BreadcrumbHeader>

        {error && (
          <Fade in>
            <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 3 }}>
              {error.message || "An error occurred fetching appointments."}
            </Alert>
          </Fade>
        )}

        <Box sx={{ mx: { xs: 0.7, sm: 1.5, md: 3, lg: 6 } }}>
          <Grid container spacing={3}>
            {/* Left Side: Filter (Hidden on mobile) */}
            <Grid size={{ xs: 12, md: 3.5, lg: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
              <Box sx={{ position: "sticky", top: 100 }}>
                <AppointmentsFilterSection status={statusFilter} onStatusChange={setStatusFilter} onApply={handleApplyFilter} forceCard={true} />
              </Box>
            </Grid>

            {/* Right Side: Appointments Grid */}
            <Grid size={{ xs: 12, md: 8.5, lg: 9 }}>
              {loading ? (
                <Grid container spacing={2.5}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
                      <AppointmentReviewCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : appointments.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 10, borderRadius: 4, border: "1.5px dashed rgba(184,151,42,0.28)", bgcolor: GOLD_BG }}>
                  <CalendarMonthIcon sx={{ fontSize: 52, color: GOLD, opacity: 0.25, mb: 2 }} />
                  <Typography sx={{ color: TEXT_MID, fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>
                    No appointments found
                  </Typography>
                  <Typography variant="caption" sx={{ color: TEXT_MID, opacity: 0.65 }}>
                    Try choosing a different status filter
                  </Typography>
                </Box>
              ) : (
                <>
                  <Grid container spacing={2.5}>
                    {appointments.map((a) => (
                      <Grid key={a.id} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
                        <AppointmentReviewCard
                          appointment={a}
                          onShowRate={handleShowRate}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        sx={{
                          "& .MuiPaginationItem-root": {
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            "&.Mui-selected": {
                              bgcolor: GOLD,
                              color: "white",
                              "&:hover": { bgcolor: GOLD_DARK }
                            },
                            "&:hover:not(.Mui-selected)": {
                              bgcolor: "#fdf8ec",
                              color: GOLD_DARK
                            },
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
  );
}
