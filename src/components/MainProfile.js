import { Avatar, Card, CardContent , Link, Typography , Button } from "@mui/material";
import dayjs from "dayjs";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useNavigate } from 'react-router-dom';



export default function MainProfile({ user }) {
    
    const navigate = useNavigate();

    const calculateAge = (dob) => {
      return dayjs().diff(dayjs(dob), "year");
    };

  return (
    <>
      <Card sx={{ p: 3, textAlign: "center", mb: 3 }}>
        <Avatar src={user.user.imagePath} sx={{ width: 200, height: 200, mx: "auto", mb: 2 }} />
        <Typography variant="h5" fontWeight="bold">{user.user.userName}</Typography>
        <Typography variant="body1" color="text.secondary">{user.user.email}</Typography>
        <Typography variant="body2" color="text.secondary">{user.role[0]}</Typography>
        <Typography variant="body2" color="text.secondary">{user.user.country}</Typography>
        <Button
              variant="contained"
              onClick={() => navigate('/edit-Profile')}
              startIcon={<EditSquareIcon />}
              sx={{ textTransform: 'none', fontSize: '1.1rem', py: 1.5, mt:2 }}
            >
              Edit Profile
        </Button>
      </Card>
      <Card sx={{ p: 3, textAlign: "center", mb: 3 }}>
        <CardContent>
          <Typography>  <strong>Age:</strong>{" "}{user?.user?.dateOfBirth ? calculateAge(user.user.dateOfBirth) : "N/A"}</Typography>
          <Typography><strong>RegisterDate:</strong> {user.user.registerDate || "N/A"}</Typography>
        </CardContent>
      </Card>
    </>
  );
}
