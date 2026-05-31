import React, { useEffect, useState } from "react";
import {
  Container, Typography, Button, TextField, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Stack, Card, CardContent, Chip, Grid, IconButton, Tooltip, Paper, Tab, Tabs, Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../../../contexts/AuthContext";
import { useDoctorSchedule, useAddSchedule, useUpdateSchedule, useDeleteSchedule } from "../hooks/useSchedule";

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
export default function DoctorSchedulePage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: rawAvailabilities, isLoading: loading } = useDoctorSchedule(user?.id);
  const addScheduleMutation = useAddSchedule();
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

  const normalizeAvailabilities = (data) => {
    return (data || []).map(a => ({
      id: a.id || a.Id,
      startTime: a.startTime || a.StartTime,
      endTime: a.endTime || a.EndTime,
      isBooked: a.isBooked !== undefined ? a.isBooked : a.IsBooked,
      doctorId: a.doctorId || a.DoctorId
    }));
  };
  
  const availabilities = normalizeAvailabilities(rawAvailabilities);

  const [day, setDay] = useState("");
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [recurrencePattern, setRecurrencePattern] = useState("None");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const grouped = {};
    availabilities.forEach((a) => {
      if (!a.startTime) return;
      try {
        const dateKey = new Date(a.startTime).toISOString().split("T")[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(a);
      } catch (e) {
        console.error("Invalid startTime for grouping:", a.startTime);
      }
    });
    setGroupedByDay(grouped);
  }, [availabilities]);

  const filteredDays = Object.keys(groupedByDay).filter((date) => {
    const d = new Date(date);
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  });

  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const handlePreviousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const handleAddSlot = () => {
    if (!startTime || !endTime) return alert("Please select both start and end times");
    if (startTime >= endTime) return alert("End time must be after start time");
    setSlots([...slots, { startTime, endTime }]);
    setStartTime(""); setEndTime("");
  };

  const handleDeleteSlot = (index) => setSlots(slots.filter((_, i) => i !== index));

  const handleSaveAllConfirm = async () => {
    setSaving(true);
    try {
      const newSlots = slots.map((s) => ({
        doctorId: user.id, startTime: `${day}T${s.startTime}`, endTime: `${day}T${s.endTime}`,
        isBooked: false, recurrencePattern, recurrenceEndDate: recurrencePattern !== "None" ? recurrenceEndDate : null,
      }));

      for (const slot of newSlots) await addScheduleMutation.mutateAsync(slot);

      setSlots([]); setDay(""); setRecurrencePattern("None"); setRecurrenceEndDate(""); setOpenDialog(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteScheduleMutation.mutateAsync(id);
    } catch (err) { console.error(err); }
  };

  const handleEditClick = (slot) => { setEditingSlot(slot); setOpenEditDialog(true); };

  const handleSaveEdit = async () => {
    try {
      if (editingSlot.startTime >= editingSlot.endTime) return alert("End time must be after start time");
      await updateScheduleMutation.mutateAsync({ id: editingSlot.id, data: editingSlot });
      setOpenEditDialog(false); setEditingSlot(null);
    } catch (err) { console.error(err); }
  };

  const formatTime = (datetime) => new Date(datetime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const inputSx = {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: GOLD, borderWidth: "2px" },
    "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK },
  };

  // Skeleton loader removed from top level so the layout doesn't jump

  return (
    <>
<Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", py: 6, fontFamily: "'Inter', sans-serif" }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, display: "flex", alignItems: "center", gap: 1.5, color: TEXT_DARK, letterSpacing: "-0.5px" }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, background: `linear-gradient(135deg, ${GOLD_BG}, #fff)`, border: `1px solid ${GOLD}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarMonthIcon sx={{ color: GOLD, fontSize: 24 }} />
              </Box>
              Doctor Schedule
            </Typography>
            <Typography sx={{ color: TEXT_MID, ml: 7 }}>
              Manage your availability and appointments
            </Typography>
          </Box>

          <Box sx={{ mb: 4, display: "inline-block", background: "#fff", borderRadius: 3, p: 0.5, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: `1px solid ${GOLD}20` }}>
            <Tabs
              value={tabValue} onChange={(e, val) => setTabValue(val)}
              sx={{ minHeight: 40, "& .MuiTabs-indicator": { display: "none" } }}
            >
              <Tab label="View Schedule" icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600, minHeight: 40, borderRadius: 2, "&.Mui-selected": { bgcolor: GOLD_BG, color: GOLD_DARK } }} />
              <Tab label="Add New Slots" icon={<AddIcon sx={{ fontSize: 18 }} />} iconPosition="start" sx={{ textTransform: "none", fontWeight: 600, minHeight: 40, borderRadius: 2, "&.Mui-selected": { bgcolor: GOLD_BG, color: GOLD_DARK } }} />
            </Tabs>
          </Box>

          {/* View Schedule Tab */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 4, gap: 2 }}>
                <IconButton onClick={handlePreviousMonth} sx={{ bgcolor: "#fff", border: `1px solid ${GOLD}40`, "&:hover": { bgcolor: GOLD_BG } }}><ChevronLeftIcon sx={{ fontSize: 20, color: GOLD_DARK }} /></IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_DARK, minWidth: 150, textAlign: "center" }}>
                  {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                </Typography>
                <IconButton onClick={handleNextMonth} sx={{ bgcolor: "#fff", border: `1px solid ${GOLD}40`, "&:hover": { bgcolor: GOLD_BG } }}><ChevronRightIcon sx={{ fontSize: 20, color: GOLD_DARK }} /></IconButton>
              </Box>

              {loading ? (
                <Grid container spacing={3}>
                  {[1, 2, 3, 4].map((i) => (
                    <Grid item xs={12} md={6} key={i}>
                      <Skeleton animation="wave" variant="rectangular" height={220} sx={{ borderRadius: 4 }} />
                    </Grid>
                  ))}
                </Grid>
              ) : filteredDays.length > 0 ? (
                <Grid container spacing={3}>
                  {filteredDays.map((day) => (
                    <Grid item xs={12} md={6} key={day}>
                      <Card elevation={0} sx={{ border: `1px solid ${GOLD}25`, borderRadius: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.03)" }}>
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ bgcolor: GOLD_BG, px: 3, py: 2, borderBottom: `1px solid ${GOLD}20` }}>
                            <Typography sx={{ fontWeight: 800, color: GOLD_DARK }}>
                              {new Date(day).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                            </Typography>
                          </Box>

                          <Stack spacing={1.5} sx={{ p: 3 }}>
                            {groupedByDay[day].map((slot) => (
                              <Box key={slot.id} sx={{ p: 2, bgcolor: slot.isBooked ? "#fff" : "#fcfaf5", borderRadius: 3, border: `1px solid ${slot.isBooked ? '#e2e8f0' : `${GOLD}30`}`, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: slot.isBooked ? "none" : `0 4px 12px ${GOLD}10` }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  <AccessTimeIcon sx={{ fontSize: 20, color: slot.isBooked ? "#94a3b8" : GOLD }} />
                                  <Box>
                                    <Typography sx={{ fontWeight: 700, color: TEXT_DARK, fontSize: "0.95rem" }}>
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                    </Typography>
                                    {slot.isBooked && (
                                      <Chip label="Booked" size="small" sx={{ mt: 0.5, bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: "0.7rem", height: 20 }} />
                                    )}
                                  </Box>
                                </Box>

                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="Edit">
                                    <IconButton size="small" onClick={() => handleEditClick(slot)} sx={{ color: TEXT_MID, bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", "&:hover": { color: GOLD_DARK, bgcolor: GOLD_BG } }}>
                                      <EditIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton size="small" onClick={() => handleDelete(slot.id)} sx={{ color: "#ef4444", bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", "&:hover": { color: "#b91c1c", bgcolor: "#fef2f2" } }}>
                                      <DeleteIcon sx={{ fontSize: 16 }} />
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
                <Paper elevation={0} sx={{ p: 6, textAlign: "center", bgcolor: "#fff", borderRadius: 4, border: `1px dashed ${GOLD}60` }}>
                  <CalendarMonthIcon sx={{ fontSize: 48, color: `${GOLD}40`, mb: 2 }} />
                  <Typography sx={{ color: TEXT_MID, fontWeight: 500 }}>No availabilities for this month</Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Add Slots Tab */}
          {tabValue === 1 && (
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, border: `1px solid ${GOLD}20`, boxShadow: "0 12px 48px rgba(0,0,0,0.04)" }}>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.3px" }}>Create New Slots</Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Select Day" type="date" value={day} onChange={(e) => setDay(e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select fullWidth label="Recurrence Pattern" value={recurrencePattern} onChange={(e) => setRecurrencePattern(e.target.value)} sx={inputSx}>
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="BiWeekly">Every 2 Weeks</MenuItem>
                  </TextField>
                </Grid>
                {recurrencePattern !== "None" && (
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Recurrence End Date" type="date" value={recurrenceEndDate} onChange={(e) => setRecurrenceEndDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />
                  </Grid>
                )}
              </Grid>

              <Box sx={{ p: 4, bgcolor: GOLD_BG, borderRadius: 3, mb: 4, border: `1px solid ${GOLD}30` }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Start Time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="End Time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} InputLabelProps={{ shrink: true }} sx={inputSx} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth onClick={handleAddSlot} startIcon={<AddIcon />}
                      sx={{ height: 56, borderRadius: 2, fontWeight: 700, bgcolor: GOLD, color: "white", "&:hover": { bgcolor: GOLD_DARK } }}
                    >
                      Add Slot
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {slots.length > 0 && (
                <>
                  <Typography sx={{ fontWeight: 600, color: TEXT_MID, mb: 2 }}>Slots to Save:</Typography>
                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {slots.map((s, i) => (
                      <Box key={i} sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, border: `1px solid #e2e8f0`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 600, color: TEXT_DARK }}>{s.startTime} - {s.endTime}</Typography>
                        <IconButton size="small" onClick={() => handleDeleteSlot(i)} sx={{ color: "#ef4444" }}><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    fullWidth onClick={() => setOpenDialog(true)}
                    sx={{ py: 1.8, borderRadius: 50, fontWeight: 700, fontSize: "1rem", color: "white", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, boxShadow: `0 6px 20px ${GOLD}40`, "&:hover": { background: GOLD_DARK } }}
                  >
                    Save All Slots
                  </Button>
                </>
              )}
            </Paper>
          )}

          {/* Confirm Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { borderRadius: 3, width: 400 } }}>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${GOLD}20`, bgcolor: GOLD_BG }}>Confirm Save</DialogTitle>
            <DialogContent sx={{ pt: "24px !important" }}>
              <Typography sx={{ color: TEXT_MID }}>Save <strong>{slots.length}</strong> slot(s) for <strong>{new Date(day).toLocaleDateString()}</strong>?</Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenDialog(false)} sx={{ color: TEXT_MID, fontWeight: 600 }}>Cancel</Button>
              <Button onClick={handleSaveAllConfirm} disabled={saving} variant="contained" sx={{ bgcolor: GOLD, color: "white", borderRadius: 50, px: 3, "&:hover": { bgcolor: GOLD_DARK } }}>{saving ? "Saving..." : "Confirm"}</Button>
            </DialogActions>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} PaperProps={{ sx: { borderRadius: 3, width: 400 } }}>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${GOLD}20`, bgcolor: GOLD_BG }}>Edit Slot</DialogTitle>
            <DialogContent sx={{ pt: "24px !important" }}>
              {editingSlot && (
                <Stack spacing={3}>
                  <TextField fullWidth label="Start Time" type="datetime-local" value={editingSlot.startTime.slice(0, 16)} onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value + ":00" })} sx={inputSx} />
                  <TextField fullWidth label="End Time" type="datetime-local" value={editingSlot.endTime.slice(0, 16)} onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value + ":00" })} sx={inputSx} />
                </Stack>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenEditDialog(false)} sx={{ color: TEXT_MID, fontWeight: 600 }}>Cancel</Button>
              <Button onClick={handleSaveEdit} variant="contained" sx={{ bgcolor: GOLD, color: "white", borderRadius: 50, px: 3, "&:hover": { bgcolor: GOLD_DARK } }}>Save</Button>
            </DialogActions>
          </Dialog>

        </Container>
      </Box>
    </>
  );
}
