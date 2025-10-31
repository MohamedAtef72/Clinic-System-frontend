import { Card, CardContent, Typography, Avatar, Button, Box } from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../contexts/AuthContext";

export default function DoctorCard({ doctor }) {
    const navigate = useNavigate();
    const { user } = useAuth();

  return (
    <Card sx={{ p: 1.5, borderRadius: 3, textAlign: "center", height: "100%", width: 300}}>
      <Avatar
        alt={doctor.userName}
        src={doctor.imagePath || "/default-doctor.png"}
        sx={{ width: 120, height: 120, mx: "auto"}}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {doctor.userName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {doctor.specialityName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {doctor.country}
        </Typography>
        {user && user.role === "Patient" && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" size="medium" sx={{px:6}} onClick={() => navigate(`/book-appointment/${doctor.id}`)}>
            Book
          </Button>
        </Box>
        )}
        {user && (user.role === "Admin" || user.role === "Receptionist") && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              size="medium"
              color="secondary"
              onClick={() => navigate(`/update-doctor-price/${doctor.id}`)}
            >
              Set Price
            </Button>
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" size="medium" onClick={() => navigate(`/doctor/${doctor.id}`)}>
            View Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
