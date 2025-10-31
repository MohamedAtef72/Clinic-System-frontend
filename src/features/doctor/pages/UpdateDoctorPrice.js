import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { setPrice as SetPrice } from "../../../services/authService";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateDoctorPrice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        price: parseInt(price),
      };
      const response = await SetPrice(id, payload);
      setSuccessMessage(response.message || "Doctor price updated successfully!");
      setOpenDialog(true);
    } catch (err) {
      console.error("Error updating price:", err);
      setSuccessMessage("Error updating price. Please try again.");
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (successMessage.includes("successfully")) {
      navigate("/doctors");
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Update Doctor Price
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Consultation Price"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>

      {/* Dialog for confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <DialogContentText>{successMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
