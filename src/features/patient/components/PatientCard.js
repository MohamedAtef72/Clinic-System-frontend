import { Card, Typography, Avatar, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";
import { deleteProfile } from '../../../services/userService';
import { FaUser, FaGlobe } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';

import { GOLD, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
export default function PatientCard({ patient }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isDeleted = patient.isDeleted === true;

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteProfile(patient.userId);
      setOpenDeleteDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        width: "300px",
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        position: "relative",
        border: `1px solid rgba(184,151,42,0.15)`,
        background: "#fff",
        transition: "all 0.3s ease",
        opacity: isDeleted ? 0.6 : 1,
        filter: isDeleted ? "grayscale(80%)" : "none",
        pointerEvents: isDeleted ? "none" : "auto",
        "&:hover": {
          transform: isDeleted ? "none" : "translateY(-4px)",
          boxShadow: isDeleted ? "none" : `0 12px 30px rgba(184,151,42,0.12)`,
          borderColor: isDeleted ? "" : `${GOLD}40`,
        },
      }}
    >
      {isDeleted && (
        <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1, pointerEvents: "none" }}>
          <Chip
            label="Unavailable"
            size="small"
            sx={{ backgroundColor: "#ef4444", color: "#fff", fontWeight: 700, fontSize: "0.7rem" }}
          />
        </Box>
      )}

      {/* Top Section: Photo + Info */}
      <Box
        sx={{
          display: "flex",
          p: 3,
          gap: 3,
          alignItems: "flex-start",
          flex: "0 0 auto",
          minHeight: 130,
        }}
      >
        {/* Avatar */}
        <Box sx={{ flexShrink: 0 }}>
          <Avatar
            alt={patient.userName}
            src={patient.imagePath || "/default-patient.png"}
            sx={{
              width: 80,
              height: 80,
              border: `3px solid #fdf8ec`,
              boxShadow: `0 4px 14px rgba(184,151,42,0.15)`,
            }}
          />
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            title={patient.userName}
            sx={{
              fontWeight: 800,
              color: TEXT_DARK,
              fontSize: "0.95rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              overflowWrap: "anywhere",
            }}
          >
            {patient.userName}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.8, color: GOLD_DARK }}>
            <FaUser size={12} />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.82rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {patient.gender || "Patient"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, color: TEXT_MID }}>
            <FaGlobe size={12} />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "0.82rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {patient.country || "Not specified"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Bottom Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          px: 3,
          pb: 3,
          pt: 2,
          borderTop: "1px solid rgba(184,151,42,0.08)",
          mt: "auto",
        }}
      >
        {/* Main action buttons row */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            disabled={isDeleted}
            onClick={() => !isDeleted && navigate(`/patient/${patient.id}`)}
            sx={{
              flex: 1,
              borderRadius: 50,
              py: 1,
              fontWeight: 700,
              textTransform: "none",
              borderColor: `${GOLD}50`,
              color: GOLD_DARK,
              "&:hover": { borderColor: GOLD, bgcolor: "#fdf8ec" },
            }}
          >
            Profile
          </Button>
        </Box>

        {/* Remove button row */}
        <Box sx={{ minHeight: 36 }}>
          {user?.role === "Admin" && (
            <Button
              variant="outlined"
              disabled={isDeleted}
              onClick={() => setOpenDeleteDialog(true)}
              sx={{
                display: "flex",
                gap: 1,
                borderRadius: 50,
                width: "100%",
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                borderColor: GOLD,
                bgcolor: GOLD,
                "&:hover": { borderColor: GOLD, bgcolor: GOLD_DARK },
              }}
            >
              <DeleteIcon />Remove Patient
            </Button>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ pt: "24px !important" }}>
          <Typography sx={{ color: TEXT_MID }}>
            Are you sure you want to delete this patient's profile?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: TEXT_MID, fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleteLoading}
            sx={{ bgcolor: "#ef4444", borderRadius: 50, px: 3, "&:hover": { bgcolor: "#dc2626" } }}
          >
            {deleteLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
