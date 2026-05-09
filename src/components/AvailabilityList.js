import React, { useState } from "react";
import {
  IconButton, Collapse, Box, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, InputAdornment, Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../theme/tokens";
export default function AvailabilityList({ data, onDelete, onEdit }) {
  const [openDay,        setOpenDay]        = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSlot,    setCurrentSlot]    = useState(null);
  const [newStart,       setNewStart]       = useState("");
  const [newEnd,         setNewEnd]         = useState("");
  const [editError,      setEditError]      = useState("");

  if (!data.length) {
    return (
      <Box
        sx={{
          textAlign: "center", py: 8,
          borderRadius: 3,
          border: "1px dashed rgba(184,151,42,0.3)",
          bgcolor: GOLD_BG,
        }}
      >
        <EventBusyIcon sx={{ fontSize: 48, color: `${GOLD}66`, mb: 1.5 }} />
        <Typography sx={{ color: TEXT_MID, fontWeight: 500 }}>No availability slots found.</Typography>
        <Typography variant="caption" sx={{ color: `${TEXT_MID}88` }}>Add a time slot above to get started.</Typography>
      </Box>
    );
  }

  /* Group by date */
  const groupedByDate = data.reduce((acc, slot) => {
    const date = new Date(slot.startTime).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  const handleToggle = (day) => setOpenDay(openDay === day ? null : day);

  const handleOpenEdit = (slot) => {
    setCurrentSlot(slot);
    const fmt = (d) => {
      const dt = new Date(d);
      return `${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}`;
    };
    setNewStart(fmt(slot.startTime));
    setNewEnd(fmt(slot.endTime));
    setEditError("");
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setCurrentSlot(null);
    setNewStart("");
    setNewEnd("");
    setEditError("");
  };

  const handleSaveEdit = () => {
    if (!newStart || !newEnd) { setEditError("Please enter both times."); return; }
    if (newStart >= newEnd)   { setEditError("End time must be after start time."); return; }
    const dateStr = new Date(currentSlot.startTime).toISOString().split("T")[0];
    onEdit(currentSlot, {
      startTime: `${dateStr}T${newStart}`,
      endTime:   `${dateStr}T${newEnd}`,
    });
    handleCloseEdit();
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5, bgcolor: "#fafafa",
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: GOLD },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: GOLD, borderWidth: 2 },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: GOLD },
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {Object.keys(groupedByDate).map((day) => {
          const slots     = groupedByDate[day];
          const isOpen    = openDay === day;
          const available = slots.filter((s) => !s.isBooked).length;
          const booked    = slots.filter((s) => s.isBooked).length;

          return (
            <Box
              key={day}
              sx={{
                borderRadius: 3,
                border: `1px solid ${isOpen ? GOLD + "50" : "rgba(184,151,42,0.15)"}`,
                overflow: "hidden",
                boxShadow: isOpen ? `0 4px 20px ${GOLD}15` : "none",
                transition: "all 0.3s ease",
              }}
            >
              {/* Day header row */}
              <Box
                onClick={() => handleToggle(day)}
                sx={{
                  display: "flex", alignItems: "center", gap: 2,
                  px: 3, py: 2,
                  bgcolor: isOpen ? GOLD_LIGHT : "#fff",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  "&:hover": { bgcolor: GOLD_BG },
                }}
              >
                <CalendarMonthIcon sx={{ color: GOLD, fontSize: 20, flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: TEXT_DARK }}>{day}</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                    <Box sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#166534", bgcolor: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 50, px: 1, py: 0.15 }}>
                      {available} available
                    </Box>
                    {booked > 0 && (
                      <Box sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#991b1b", bgcolor: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 50, px: 1, py: 0.15 }}>
                        {booked} booked
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{ fontSize: "0.72rem", fontWeight: 700, color: GOLD, mr: 0.5, whiteSpace: "nowrap" }}>
                  {slots.length} slot{slots.length !== 1 ? "s" : ""}
                </Box>
                <IconButton
                  size="small"
                  sx={{ color: GOLD, bgcolor: `${GOLD}15`, "&:hover": { bgcolor: `${GOLD}25` } }}
                >
                  {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
              </Box>

              {/* Collapsible slot list */}
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ bgcolor: "#fafaf7", px: 2, pb: 2, pt: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {slots.map((slot) => {
                      const isBooked = slot.isBooked;
                      return (
                        <Box
                          key={slot.id}
                          sx={{
                            display: "flex", alignItems: "center", gap: 2,
                            px: 2.5, py: 1.5,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            border: `1px solid ${isBooked ? "#fca5a5" : "rgba(184,151,42,0.15)"}`,
                            transition: "all 0.2s",
                            "&:hover": { borderColor: GOLD, boxShadow: `0 2px 10px ${GOLD}15` },
                          }}
                        >
                          <AccessTimeIcon sx={{ color: GOLD, fontSize: 18, flexShrink: 0 }} />
                          <Typography sx={{ flex: 1, fontSize: "0.88rem", fontWeight: 600, color: TEXT_DARK }}>
                            {new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {" "}<span style={{ color: TEXT_MID, fontWeight: 400 }}>→</span>{" "}
                            {new Date(slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </Typography>
                          <Box sx={{
                            px: 1.2, py: 0.3, borderRadius: 50, fontSize: "0.7rem", fontWeight: 700,
                            bgcolor: isBooked ? "#fee2e2" : "#dcfce7",
                            color: isBooked ? "#991b1b" : "#166534",
                            border: `1px solid ${isBooked ? "#fca5a5" : "#bbf7d0"}`,
                          }}>
                            {isBooked ? "Booked" : "Available"}
                          </Box>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(slot)}
                              sx={{ color: GOLD, bgcolor: GOLD_BG, "&:hover": { bgcolor: GOLD_LIGHT }, borderRadius: 1.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete(slot.id)}
                              sx={{ color: "#ef4444", bgcolor: "#fee2e2", "&:hover": { bgcolor: "#fecaca" }, borderRadius: 1.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* ── Edit Dialog ── */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${GOLD}22`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            minWidth: 360,
          },
        }}
      >
        {/* Title */}
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${GOLD}20`,
            bgcolor: GOLD_BG,
            display: "flex", alignItems: "center", gap: 1.5,
            py: 2, px: 3,
          }}
        >
          <EditIcon sx={{ color: GOLD, fontSize: 20 }} />
          <Typography fontWeight={700} fontSize="1rem" color={TEXT_DARK}>
            Edit Time Slot
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, px: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {editError && (
              <Alert severity="error" sx={{ borderRadius: 2, border: "1px solid rgba(211,47,47,0.2)" }}>
                {editError}
              </Alert>
            )}
            <TextField
              label="Start Time"
              type="time"
              value={newStart}
              onChange={(e) => { setNewStart(e.target.value); setEditError(""); }}
              InputLabelProps={{ shrink: true }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon sx={{ color: GOLD, fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
            <TextField
              label="End Time"
              type="time"
              value={newEnd}
              onChange={(e) => { setNewEnd(e.target.value); setEditError(""); }}
              InputLabelProps={{ shrink: true }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon sx={{ color: GOLD, fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5, borderTop: `1px solid ${GOLD}15`, gap: 1 }}>
          <Button
            onClick={handleCloseEdit}
            sx={{
              borderRadius: 50, px: 2.5, py: 0.9, fontWeight: 600,
              fontSize: "0.88rem", textTransform: "none",
              color: TEXT_MID, border: "1.5px solid rgba(74,74,106,0.2)",
              "&:hover": { bgcolor: "#f4f4f8" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            sx={{
              borderRadius: 50, px: 2.5, py: 0.9, fontWeight: 700,
              fontSize: "0.88rem", textTransform: "none",
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
              color: "white",
              boxShadow: `0 4px 14px ${GOLD}40`,
              "&:hover": { background: GOLD_DARK, transform: "translateY(-1px)" },
              transition: "all 0.22s",
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}