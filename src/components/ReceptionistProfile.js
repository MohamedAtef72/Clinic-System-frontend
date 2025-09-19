import { Card, CardContent, Typography } from "@mui/material";

export default function ReceptionistProfile({ user }) {
  return (
    <Card sx={{ p: 3, textAlign: "center", mb: 3 }}>
      <CardContent>
        <Typography><strong>Shift Start:</strong> {user.user.shiftStart || "N/A"}</Typography>
        <Typography><strong>Shift End:</strong> {user.user.shiftEnd || "N/A"}</Typography>
      </CardContent>
    </Card>
  );
}
