import {
  Container,
  Grid,
  Typography,
  Pagination,
  CircularProgress,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import DoctorCard from "../components/DoctorCard";
import SearchBar from "../../../components/SearchBar";
import { getAllDoctors } from "../../../services/authService";

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await getAllDoctors(pageNumber, searchTerm);
      setDoctors(res.data || []);
      setTotalCount(res.totalCount || 0);
      setPageSize(res.pageSize || 10);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch when pageNumber OR searchTerm changes
  useEffect(() => {
    fetchDoctors();
  }, [pageNumber, searchTerm]);

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Our Doctors
      </Typography>
      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Meet our qualified specialists ready to serve you
      </Typography>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container justifyContent={"center"} spacing={3}>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <Grid item xs={12} sm={6} md={4} key={doctor.id} sx={{ mb: 2 }}>
                  <DoctorCard doctor={doctor} />
                </Grid>
              ))
            ) : (
              <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
                No doctors found.
              </Typography>
            )}
          </Grid>

          {/* Pagination */}
          {totalCount > pageSize && (
            <Grid container justifyContent="center" sx={{ mt: 6 }}>
              <Pagination
                count={Math.ceil(totalCount / pageSize)}
                page={pageNumber}
                onChange={(e, value) => setPageNumber(value)}
                color="primary"
              />
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}
