import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoctorById } from "../services/authService"; // axios instance
import { Container,Card,CardContent,CardMedia,Typography,Grid,CircularProgress,Divider,Box } from "@mui/material";
import { FaUserMd, FaEnvelope, FaGlobe, FaVenusMars, FaBirthdayCake } from "react-icons/fa";

export default function ViewDoctorProfile() {
  const { id } = useParams(); 
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const fetchDoctor = async () => {
      try{
      setLoading(true);
      const res = await getDoctorById(id);
      setDoctor(res.data);
      setLoading(false);
    }catch(err){
      console.error("Error fetching doctor by ID:", err);
      setLoading(false);
    }
  }
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!doctor) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Doctor not found!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5  , mb:2}}>
      <Card sx={{ borderRadius: 4, boxShadow: 4 }}>
        <Box
          component="img"
          src={doctor.imagePath}
          alt={doctor.userName}
          sx={{
            height: 300,
            width: 300,              
            objectFit: "contain",
            borderRadius: "152px",  
            display: "block",        
            mx: "auto",
            paddingTop: 2               
          }}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            <FaUserMd style={{ marginRight: "8px", color: "#1976d2" }} />
            Dr. {doctor.userName}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <FaEnvelope style={{ marginRight: "8px", color: "#1976d2" }} />
                <Typography>Email: {doctor.email}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <FaGlobe style={{ marginRight: "8px", color: "#1976d2" }} />
                <Typography>Country: {doctor.country}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <FaVenusMars style={{ marginRight: "8px", color: "#1976d2" }} />
                <Typography>Gender: {doctor.gender}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <FaBirthdayCake style={{ marginRight: "8px", color: "#1976d2" }} />
                <Typography>DOB: {new Date(doctor.dateOfBirth).toLocaleDateString()}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <FaUserMd style={{ marginRight: "8px", color: "#1976d2" }} />
                <Typography>Speciality: {doctor.specialityName}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Registered on: {new Date(doctor.registerDate).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
