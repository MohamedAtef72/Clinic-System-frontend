import { Card, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";


export default function DoctorProfile({ user }) {

    const calculateExperience = (dob) => {
        return dayjs().diff(dayjs(dob), "year");
    };

  return (
    <Card sx={{ p: 3, textAlign: "center", mb: 3 }}>
      <CardContent>
        <Typography><strong>Speciality:</strong> {user.user.specialityName || "N/A"}</Typography>
        <Typography><strong>Experience:</strong> {user?.user?.registerDate ? calculateExperience(user.user.registerDate) : "N/A"}</Typography>
        <Typography><strong>Schedule:</strong> {user.schedule || "N/A"}</Typography>
      </CardContent>
    </Card>
  );
}
