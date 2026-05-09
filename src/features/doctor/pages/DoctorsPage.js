import { Container, Grid, Typography, Pagination, CircularProgress, Box, Card, Select, MenuItem, Breadcrumbs, Link, FormControl, InputLabel, Divider, IconButton, Drawer } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from "react";
import DoctorCard from "../components/DoctorCard";
import SearchBar from "../../../components/SearchBar";
import { getAllDoctors } from '../../../services/doctorService';
import { getAllSpecialities } from '../../../services/specialityService';
import FilterListIcon from "@mui/icons-material/FilterList";
import BookAppointmentPage from "../../appointments/pages/BookAppointmentPage";
import UpdateDoctorPrice from "./UpdateDoctorPrice";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [specialityFilter, setSpecialityFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [bookingDoctorId, setBookingDoctorId] = useState(null);
  const [updatingPriceDoctorId, setUpdatingPriceDoctorId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, specRes] = await Promise.all([
        getAllDoctors(pageNumber, searchTerm, genderFilter, specialityFilter),
        getAllSpecialities()
      ]);
      setDoctors(docRes.data || docRes.Data || []);
      setTotalCount(docRes.totalCount || docRes.TotalCount || 0);
      setPageSize(docRes.pageSize || docRes.PageSize || 10);
      setSpecialities(specRes || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, specialityFilter, genderFilter]);

  useEffect(() => {
    fetchData();
  }, [pageNumber, searchTerm, specialityFilter, genderFilter]);

  // The API now handles searching, speciality, and gender filtering on the server
  const displayedDoctors = doctors;

  const filterContent = (
    <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid rgba(184,151,42,0.15)`, bgcolor: "#fff", p: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.03)" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FilterListIcon />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: TEXT_DARK }}>Filters</Typography>
      </Box>
      <Divider sx={{ mb: 3, borderColor: `rgba(184,151,42,0.1)` }} />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: TEXT_MID, fontWeight: 500 }}>Speciality</InputLabel>
        <Select
          value={specialityFilter}
          label="Speciality"
          onChange={(e) => setSpecialityFilter(e.target.value)}
          sx={{ borderRadius: 3, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GOLD } }}
        >
          <MenuItem value=""><em>All Specialities</em></MenuItem>
          {specialities.map((spec) => (
            <MenuItem key={spec.id} value={spec.id}>{spec.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel sx={{ color: TEXT_MID, fontWeight: 500 }}>Gender</InputLabel>
        <Select
          value={genderFilter}
          label="Gender"
          onChange={(e) => setGenderFilter(e.target.value)}
          sx={{ borderRadius: 3, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GOLD } }}
        >
          <MenuItem value=""><em>Any Gender</em></MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
    </Card>
  );

  return (
    <>
<Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", py: { xs: 5, md: 5 }, pb: 8, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth={false} sx={{ px: { xs: 2.5, md: 5, lg: 8 } }}>

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
                  Doctors
                </Typography>
              </Breadcrumbs>
            </Box>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                onClick={() => setMobileFilterOpen(true)}
                sx={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: 'white',
                  borderRadius: 3, width: 44, height: 44,
                  boxShadow: `0 4px 12px ${GOLD}30`,
                  "&:hover": { background: GOLD_DARK }
                }}
              >
                <FilterListIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Box>

          {/* Master Container for Filters and Cards */}
          <Box sx={{ mx: { xs: 0.7, sm: 1.5, md: 3, lg: 6 } }}>
            <Grid container spacing={4} sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>

              {/* Left Side: Filter (Hidden on mobile) */}
              <Grid item sx={{ width: "300px", flexShrink: 0, display: { xs: "none", md: "block" } }}>
                <Box sx={{ position: "sticky", top: 100 }}>
                  {filterContent}
                </Box>
              </Grid>

              {/* Right Side: Doctors Grid OR Booking Phase */}
              <Grid item xs sx={{ minWidth: 0 }}>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                    <CircularProgress sx={{ color: GOLD }} />
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={3}>
                      {displayedDoctors.length > 0 ? (
                        displayedDoctors.map((doctor) => (
                          <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
                            <DoctorCard
                              doctor={doctor}
                              onBook={setBookingDoctorId}
                              onUpdatePrice={setUpdatingPriceDoctorId}
                            />
                          </Grid>
                        ))
                      ) : (
                        <Box sx={{ textAlign: "center", py: 10, width: "100%" }}>
                          <Typography sx={{ color: TEXT_MID, fontSize: "1.1rem", fontWeight: 500 }}>
                            No doctors found matching your criteria.
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {totalCount > pageSize && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                        <Pagination
                          count={Math.ceil(totalCount / pageSize)}
                          page={pageNumber}
                          onChange={(e, value) => setPageNumber(value)}
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

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor="bottom"
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            PaperProps={{ sx: { borderTopLeftRadius: 20, borderTopRightRadius: 20, bgcolor: "#f9f8f5", p: 2 } }}
          >
            <Box sx={{ pt: 0, pb: 0 }}>
              {filterContent}
            </Box>
          </Drawer>

        </Container>

        {bookingDoctorId && (
          <BookAppointmentPage
            doctorId={bookingDoctorId}
            isDialog={true}
            open={!!bookingDoctorId}
            onClose={() => setBookingDoctorId(null)}
          />
        )}

        {updatingPriceDoctorId && (
          <UpdateDoctorPrice
            doctorId={updatingPriceDoctorId}
            isDialog={true}
            open={!!updatingPriceDoctorId}
            onClose={() => {
              setUpdatingPriceDoctorId(null);
              fetchData();
            }}
          />
        )}
      </Box>
    </>
  );
}
