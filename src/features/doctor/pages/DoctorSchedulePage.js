import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getDoctorAvailabilities,
  addAvailability,
  updateAvailability,
  deleteAvailability,
} from "../../../services/authService";
import { useAuth } from "../../../contexts/AuthContext";

export default function DoctorSchedulePage() {
  const { user } = useAuth();
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date()); // 🆕 month state

  // Form state
  const [day, setDay] = useState("");
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [recurrencePattern, setRecurrencePattern] = useState("None");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");

  // Dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load availabilities
  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const res = await getDoctorAvailabilities(user.id);
        setAvailabilities(res.data || []);
      } catch (err) {
        console.error("Error loading availabilities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailabilities();
  }, [user.id]);

  // Group by day
  useEffect(() => {
    const grouped = {};
    availabilities.forEach((a) => {
      const dateKey = new Date(a.startTime).toISOString().split("T")[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(a);
    });
    setGroupedByDay(grouped);
  }, [availabilities]);

  // Filter availabilities by current month
  const filteredDays = Object.keys(groupedByDay).filter((date) => {
    const d = new Date(date);
    return (
      d.getMonth() === currentMonth.getMonth() &&
      d.getFullYear() === currentMonth.getFullYear()
    );
  });

  // Month navigation
  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Add slot locally
  const handleAddSlot = () => {
    if (!startTime || !endTime) return alert("Please select both start and end times");
    if (startTime >= endTime) return alert("End time must be after start time");
    setSlots([...slots, { startTime, endTime }]);
    setStartTime("");
    setEndTime("");
  };

  const handleDeleteSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  // Save all slots
  const handleSaveAllConfirm = async () => {
    setSaving(true);
    try {
      const newSlots = slots.map((s) => ({
        doctorId: user.id,
        startTime: `${day}T${s.startTime}`,
        endTime: `${day}T${s.endTime}`,
        isBooked: false,
        recurrencePattern,
        recurrenceEndDate: recurrencePattern !== "None" ? recurrenceEndDate : null,
      }));

      for (const slot of newSlots) {
        await addAvailability(slot);
      }

      const updated = await getDoctorAvailabilities(user.id);
      setAvailabilities(updated.data || []);

      setSlots([]);
      setDay("");
      setRecurrencePattern("None");
      setRecurrenceEndDate("");
      setOpenDialog(false);
    } catch (err) {
      alert("Error saving slots");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAvailability(id);
      setAvailabilities(availabilities.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleEditClick = (slot) => {
    setEditingSlot(slot);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (editingSlot.startTime >= editingSlot.endTime)
        return alert("End time must be after start time");

      await updateAvailability(editingSlot.id, editingSlot);
      const res = await getDoctorAvailabilities(user.id);
      setAvailabilities(res.data || []);
      setOpenEditDialog(false);
      setEditingSlot(null);
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Calendar size={32} style={{ color: "#1976d2" }} />
          Doctor Schedule
        </Typography>
        <Typography color="text.secondary">
          Manage your availability and appointments
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
          <Tab
            label="View Schedule"
            icon={<Calendar size={20} />}
            iconPosition="start"
          />
          <Tab
            label="Add New Slots"
            icon={<Plus size={20} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* View Schedule */}
      {tabValue === 0 && (
        <Box>
          {/* Month Navigation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              gap: 2,
            }}
          >
            <IconButton onClick={handlePreviousMonth}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ChevronRight />
            </IconButton>
          </Box>

          {filteredDays.length > 0 ? (
            <Grid container spacing={2}>
              {filteredDays.map((day) => (
                <Grid item xs={12} md={6} key={day}>
                  <Card sx={{ border: "1px solid #e0e0e0" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 2 }}
                      >
                        {new Date(day).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>

                      <Stack spacing={1.5}>
                        {groupedByDay[day].map((slot) => (
                          <Box
                            key={slot.id}
                            sx={{
                              p: 1.5,
                              bgcolor: slot.isBooked ? "#fff3e0" : "#f5f5f5",
                              borderRadius: 1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Clock size={18} style={{ color: "#666" }} />
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {formatTime(slot.startTime)} -{" "}
                                  {formatTime(slot.endTime)}
                                </Typography>
                                {slot.isBooked && (
                                  <Chip
                                    label="Booked"
                                    size="small"
                                    sx={{
                                      mt: 0.5,
                                      bgcolor: "#ffb74d",
                                      color: "#fff",
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>

                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(slot)}
                                  sx={{ color: "#1976d2" }}
                                >
                                  <Edit2 size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(slot.id)}
                                  sx={{ color: "#d32f2f" }}
                                >
                                  <Trash2 size={18} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#f5f5f5" }}>
              <Calendar
                size={48}
                style={{ color: "#bdbdbd", marginBottom: 16 }}
              />
              <Typography>No availabilities for this month</Typography>
            </Paper>
          )}
        </Box>
      )}

      {/* Add Slots */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Create New Slots
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Select Day"
                type="date"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Recurrence Pattern"
                value={recurrencePattern}
                onChange={(e) => setRecurrencePattern(e.target.value)}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="BiWeekly">Every 2 Weeks</MenuItem>
              </TextField>
            </Grid>
            {recurrencePattern !== "None" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Recurrence End Date"
                  type="date"
                  value={recurrenceEndDate}
                  onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>

          <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAddSlot}
                  startIcon={<Plus size={20} />}
                  sx={{ height: 56 }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>

          {slots.length > 0 && (
            <>
              <Stack spacing={1.5}>
                {slots.map((s, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 1.5,
                      bgcolor: "#e8f5e9",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      {s.startTime} - {s.endTime}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSlot(i)}
                      sx={{ color: "#d32f2f" }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>

              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => setOpenDialog(true)}
                sx={{ mt: 3, fontWeight: 600 }}
              >
                Save All Slots
              </Button>
            </>
          )}
        </Paper>
      )}

      {/* Confirm Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Save <strong>{slots.length}</strong> slot(s) for{" "}
            <strong>{new Date(day).toLocaleDateString()}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAllConfirm} variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Slot</DialogTitle>
        <DialogContent>
          {editingSlot && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Start Time"
                type="datetime-local"
                value={editingSlot.startTime.slice(0, 16)}
                onChange={(e) =>
                  setEditingSlot({ ...editingSlot, startTime: e.target.value + ":00" })
                }
              />
              <TextField
                fullWidth
                label="End Time"
                type="datetime-local"
                value={editingSlot.endTime.slice(0, 16)}
                onChange={(e) =>
                  setEditingSlot({ ...editingSlot, endTime: e.target.value + ":00" })
                }
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
