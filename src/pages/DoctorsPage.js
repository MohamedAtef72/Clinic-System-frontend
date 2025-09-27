import { Container, Grid, Typography, Pagination, CircularProgress, Box } from "@mui/material";
import { useState, useEffect } from "react";
import DoctorCard from "../components/DoctorCard";
import SearchBar from "../components/SearchBar";
import {getAllDoctors} from "../services/authService"; // axios instance

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await getAllDoctors(pageNumber);
        setDoctors(res.data);
        setTotalCount(res.totalCount);
        setPageSize(res.pageSize);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [pageNumber]);

  // Filtered doctors (local filter on frontend)
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Our Doctors
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Meet our qualified specialists ready to serve you
      </Typography>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container justifyContent={"center"} spacing={3}>
            {filteredDoctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.id} sx={{ mb: 2}}>
                <DoctorCard doctor={doctor} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Grid container justifyContent="center" sx={{ mt: 6 }}>
            <Pagination
              count={Math.ceil(totalCount / pageSize)}
              page={pageNumber}
              onChange={(e, value) => setPageNumber(value)}
              color="primary"
            />
          </Grid>
        </>
      )}
    </Container>
  );
}
