import { Card, CardContent, Typography, Avatar, Button, Box } from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function PatientCard({ patient }) {
    const navigate = useNavigate();

  return (
    <Card sx={{ p: 1.5, borderRadius: 3, textAlign: "center", height: "100%", width: 300}}>
      <Avatar
        alt={patient.userName}
        src={patient.imagePath || "/default-patient.png"}
        sx={{ width: 120, height: 120, mx: "auto"}}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {patient.userName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {patient.specialityName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {patient.country}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" size="medium" onClick={() => navigate(`/patient/${patient.id}`)}>
            View Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
