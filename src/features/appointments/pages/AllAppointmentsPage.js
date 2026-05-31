import React, { useState } from "react";
import {
  Box, Typography, CircularProgress, Pagination,
  Grid, Container, useTheme, useMediaQuery, Skeleton
} from "@mui/material";
import { useDetailedAllAppointments } from "../hooks/useAppointments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BreadcrumbHeader from '../../../components/BreadcrumbHeader';
import { AppointmentReviewCard } from "../components/MobileAppointmentReviewCard";
import AppointmentReviewCardSkeleton from "../components/skeletons/AppointmentReviewCardSkeleton";
import AppointmentsFilterSection from "../../../components/AppointmentsFilterSection";
import ViewRatingDialog from "../../../components/ViewRatingDialog";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_MID } from "../../../theme/tokens";
/* ── Tokens ── */
export default function AllAppointmentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [ratingAppointmentId, setRatingAppointmentId] = useState(null);

  const { data: appointmentsRes, isLoading: loadingDocs } = useDetailedAllAppointments(statusFilter, page);

  const appointments = appointmentsRes?.data || [];
  const totalCount = appointmentsRes?.totalCount || 0;
  const pageSize = appointmentsRes?.pageSize || 5;
  const loading = loadingDocs;

  const handleApplyFilter = () => setPage(1);
  const handleShowRate = (appointmentId) => setRatingAppointmentId(appointmentId);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Using skeletons instead of global loader

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
                {loading ? (
                  <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Grid item xs={12} sm={6} lg={4} xl={4} key={i}>
                        <AppointmentReviewCardSkeleton />
                      </Grid>
                    ))}
                  </Grid>
                ) : appointments.length === 0 ? (
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
