import { Card, CardContent, Typography } from "@mui/material";

export default function PatientProfile({ user }) {
  return (
    <Card sx={{ p: 3, textAlign: "center", mb: 3 }}>
      <CardContent>
        <Typography><strong>Blood Type:</strong> {user.user.bloodType || "N/A"}</Typography>
        <Typography><strong>Medical History:</strong> {user.user.medicalHistory || "N/A"}</Typography>
      </CardContent>
    </Card>
  );
}
