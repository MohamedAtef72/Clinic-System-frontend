import { Card, CardContent, Typography, Avatar, Button, Box } from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function DoctorCard({ doctor }) {
    const navigate = useNavigate();

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
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" size="medium" sx={{px:6}} onClick={() => navigate(`/book-appointment/${doctor.userId}`)}>
            Book
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" size="medium" onClick={() => navigate(`/doctor/${doctor.userId}`)}>
            View Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
