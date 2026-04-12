import { Card, CardContent, Typography, Avatar, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";
import { deleteProfile } from "../../../services/authService";

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isDeleted = doctor.isDeleted === true;

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteProfile(doctor.userId);
      setOpenDeleteDialog(false);
      window.location.reload(); // Refresh the page to update the list
    } catch (error) {
      console.error("Error deleting doctor:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card
      sx={{
        p: 1.5,
        borderRadius: 3,
        textAlign: "center",
        height: "100%",
        width: 300,
        opacity: isDeleted ? 0.55 : 1,
        filter: isDeleted ? "grayscale(70%)" : "none",
        pointerEvents: isDeleted ? "none" : "auto",
        position: "relative",
      }}
    >
      {/* Unavailable badge */}
      {isDeleted && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <Chip
            label="Unavailable"
            size="small"
            sx={{
              backgroundColor: "error.main",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.7rem",
            }}
          />
        </Box>
      )}

      <Avatar
        alt={doctor.userName}
        src={doctor.imagePath || "/default-doctor.png"}
        sx={{ width: 120, height: 120, mx: "auto" }}
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

        {/* Only show action buttons when doctor is NOT deleted */}
        {!isDeleted && user && user.role === "Patient" && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              size="medium"
              sx={{ px: 6 }}
              onClick={() => navigate(`/book-appointment/${doctor.id}`)}
            >
              Book
            </Button>
          </Box>
        )}
        {!isDeleted && user && (user.role === "Admin" || user.role === "Receptionist") && (
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
          <Button
            variant="contained"
            size="medium"
            disabled={isDeleted}
            onClick={() => !isDeleted && navigate(`/doctor/${doctor.id}`)}
          >
            View Profile
          </Button>
        </Box>
        {user && user.role === "Admin" && (
          <Box sx={{ mt: 2, pointerEvents: "auto" }}>
            <Button
              variant="outlined"
              color="error"
              size="medium"
              disabled={isDeleted}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Box>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this doctor's profile?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={24} /> : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
