import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { getDoctorById } from '../../../services/doctorService';
import { getDoctorAvailabilities } from '../../../services/availabilityService';
import { createAppointment } from '../../../services/appointmentService';
import { currentUser } from '../../../services/userService';
import {
  Typography, Avatar, Button, Box, CircularProgress, Alert,
  Stack, Chip,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import { GOLD, GOLD_BG, GOLD_DARK, GOLD_LIGHT, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
/* ── Tokens ── */
const BORDER_CLR = "rgba(184,151,42,0.2)";

/* Generate recurring slots */
/* Normalize a PascalCase API slot to camelCase */
const normalize = (slot) => ({
  ...slot,
  id: slot.Id ?? slot.id,
  startTime: slot.StartTime ?? slot.startTime,
  endTime: slot.EndTime ?? slot.endTime,
  isBooked: slot.IsBooked ?? slot.isBooked,
  recurrencePattern: slot.RecurrencePattern ?? slot.recurrencePattern,
  recurrenceEndDate: slot.RecurrenceEndDate ?? slot.recurrenceEndDate,
});

const generateRecurringAvailabilities = (availabilities) => {
  const allSlots = [];
  availabilities.forEach((a) => {
    const norm = normalize(a);
    allSlots.push({ ...norm, originalId: norm.id });
    if (norm.recurrencePattern && norm.recurrenceEndDate) {
      let start = new Date(norm.startTime);
      let end = new Date(norm.endTime);
      const recurrenceEnd = new Date(norm.recurrenceEndDate);
      while (true) {
        start.setDate(start.getDate() + 7);
        end.setDate(end.getDate() + 7);
        if (start > recurrenceEnd) break;
        allSlots.push({
          ...norm,
          id: `${norm.id}-${start.toISOString()}`,
          originalId: norm.id,
          startTime: new Date(start),
          endTime: new Date(end),
        });
      }
    }
  });
  return allSlots;
};

/* Format short time */
const fmtTime = (dt) =>
  new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function BookAppointmentPage({ doctorId: propDoctorId, isDialog, open, onClose }) {
  const { doctorId: paramDoctorId } = useParams();
  const doctorId = propDoctorId || paramDoctorId;
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [patientId, setPatientId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const [doctorRes, userRes, availabilityRes] = await Promise.all
          (
            [getDoctorById(doctorId), currentUser(), getDoctorAvailabilities(doctorId)]
          );
        setDoctor(doctorRes.data);
        setPatientId(userRes.user?.id || userRes.userId);
        setAvailabilities(generateRecurringAvailabilities(availabilityRes.Data || []));
      } catch {
        setMessage({ text: "Failed to load doctor data.", type: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [doctorId]);

  useEffect(() => {
    if (!availabilities.length) return;
    const m = currentMonth.getMonth();
    const y = currentMonth.getFullYear();
    const filtered = availabilities.filter((a) => {
      const d = new Date(a.startTime);
      return d.getMonth() === m && d.getFullYear() === y;
    });
    const grouped = {};
    filtered.forEach((a) => {
      const key = new Date(a.startTime).toISOString().split("T")[0];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });
    setGroupedByDay(grouped);
    setSelectedDay("");
    setSelectedAvailability("");
  }, [availabilities, currentMonth]);

  const handleSubmit = async () => {
    if (!selectedAvailability) {
      setMessage({ text: "Please select a time slot before confirming.", type: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const slot = availabilities.find((a) => a.id.toString() === selectedAvailability.toString());
      if (!slot) throw new Error("Slot not found");
      const res = await createAppointment({
        patientId,
        availabilityId: slot.originalId,
        date: slot.startTime,
        appointmentStatus: "Schedule",
      });
      setMessage({ text: res.message || "Appointment booked successfully!", type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setMessage({ text: "Failed to create appointment. Please try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    const Loader = (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: isDialog ? "40vh" : "60vh", gap: 2 }}>
        <CircularProgress sx={{ color: GOLD }} size={40} thickness={4} />
        <Typography sx={{ color: TEXT_MID, fontSize: "0.9rem" }}>Loading doctor profile…</Typography>
      </Box>
    );
    return isDialog ? (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogContent>{Loader}</DialogContent>
      </Dialog>
    ) : Loader;
  }

  if (!doctor) {
    const ErrorState = (
      <Box sx={{ p: 4, maxWidth: 480, mx: "auto" }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>Doctor not found.</Alert>
      </Box>
    );
    return isDialog ? (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogContent>{ErrorState}</DialogContent>
      </Dialog>
    ) : ErrorState;
  }

  const days = Object.keys(groupedByDay).sort();
  const monthLabel = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const innerContent = (
    <>
      <Box>
        {isDialog && (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: TEXT_DARK }}>Book Appointment</Typography>
            <IconButton onClick={onClose} sx={{ color: TEXT_MID }}><CloseIcon /></IconButton>
          </Box>
        )}

        {/* Back button */}
        {!isDialog && (
          <Button
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3, borderRadius: 50, px: 2, py: 0.8,
              textTransform: "none", fontWeight: 600, fontSize: "0.85rem",
              color: TEXT_MID, border: "1.5px solid rgba(74,74,106,0.2)",
              "&:hover": { bgcolor: "#f0f0f8", borderColor: TEXT_MID },
              transition: "all 0.2s",
            }}
          >
            Back
          </Button>
        )}

        {/* ── Message alert ── */}
        {message.text && (
          <Alert
            severity={message.type || "info"}
            sx={{
              mb: 3, borderRadius: 2,
              ...(message.type === "success" && { bgcolor: GOLD_BG, color: GOLD_DARK, border: `1px solid ${GOLD}40`, "& .MuiAlert-icon": { color: GOLD } }),
            }}
            onClose={() => setMessage({ text: "", type: "" })}
          >
            {message.text}
          </Alert>
        )}

        {/* ── Doctor card ── */}
        <Box
          sx={{
            borderRadius: 3,
            border: `1px solid ${BORDER_CLR}`,
            bgcolor: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            overflow: "hidden",
            mb: 3,
          }}
        >
          {/* Gold top bar */}
          <Box sx={{ height: 4, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_DARK})` }} />

          <Box sx={{ p: 3, display: "flex", gap: 2.5, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Avatar */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Avatar
                src={doctor.imagePath || "/default-doctor.png"}
                alt={doctor.userName}
                sx={{
                  width: 90, height: 90,
                  border: `3px solid ${GOLD}40`,
                  boxShadow: `0 4px 20px ${GOLD}25`,
                }}
              />
              <Box
                sx={{
                  position: "absolute", bottom: 2, right: 2,
                  width: 18, height: 18, borderRadius: "50%",
                  bgcolor: "#22c55e", border: "2px solid white",
                }}
              />
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 180 }}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", color: TEXT_DARK, lineHeight: 1.2, mb: 0.5 }}>
                Dr. {doctor.userName}
              </Typography>

              {doctor.specialityName && (
                <Chip
                  icon={<LocalHospitalIcon sx={{ fontSize: "14px !important", color: `${GOLD} !important` }} />}
                  label={doctor.specialityName}
                  size="small"
                  sx={{ mb: 1, bgcolor: GOLD_BG, color: GOLD_DARK, border: `1px solid ${GOLD}30`, fontWeight: 600, fontSize: "0.72rem" }}
                />
              )}

              <Stack spacing={0.6}>
                {doctor.country && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <LocationOnOutlinedIcon sx={{ color: TEXT_MID, fontSize: 15 }} />
                    <Typography sx={{ fontSize: "0.83rem", color: TEXT_MID }}>{doctor.country}</Typography>
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <AttachMoneyIcon sx={{ color: "#22c55e", fontSize: 15 }} />
                  <Typography sx={{ fontSize: "0.83rem", color: TEXT_DARK, fontWeight: 600 }}>
                    {doctor.consulationPrice} EGP{" "}
                    <span style={{ color: TEXT_MID, fontWeight: 400 }}>/ session</span>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* ── Month navigation ── */}
        <Box
          sx={{
            borderRadius: 3, border: `1px solid ${BORDER_CLR}`,
            bgcolor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            mb: 2, overflow: "hidden",
          }}
        >
          {/* Section header */}
          <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${GOLD}15`, bgcolor: GOLD_BG, display: "flex", alignItems: "center", gap: 1 }}>
            <EventAvailableIcon sx={{ color: GOLD, fontSize: 18 }} />
            <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: TEXT_DARK }}>Choose a Date</Typography>
          </Box>

          <Box sx={{ px: 3, py: 2 }}>
            {/* Month switcher */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                startIcon={<ChevronLeftIcon />}
                sx={{
                  borderRadius: 50, px: 1.5, py: 0.7, textTransform: "none",
                  fontWeight: 600, fontSize: "0.82rem", color: TEXT_MID,
                  border: "1.5px solid rgba(74,74,106,0.2)",
                  "&:hover": { bgcolor: GOLD_BG, borderColor: GOLD, color: GOLD_DARK },
                  transition: "all 0.2s",
                }}
              >
                Previous
              </Button>
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: TEXT_DARK }}>{monthLabel}</Typography>
              <Button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                endIcon={<ChevronRightIcon />}
                sx={{
                  borderRadius: 50, px: 1.5, py: 0.7, textTransform: "none",
                  fontWeight: 600, fontSize: "0.82rem", color: TEXT_MID,
                  border: "1.5px solid rgba(74,74,106,0.2)",
                  "&:hover": { bgcolor: GOLD_BG, borderColor: GOLD, color: GOLD_DARK },
                  transition: "all 0.2s",
                }}
              >
                Next
              </Button>
            </Box>

            {/* Day chips */}
            {days.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {days.map((day) => {
                  const isSelected = selectedDay === day;
                  const dt = new Date(day);
                  const available = groupedByDay[day].filter((s) => !s.isBooked).length;
                  return (
                    <Box
                      key={day}
                      onClick={() => { setSelectedDay(day); setSelectedAvailability(""); }}
                      sx={{
                        cursor: "pointer",
                        p: 1.5, borderRadius: 2.5, minWidth: 80, textAlign: "center",
                        border: isSelected ? `2px solid ${GOLD}` : "1.5px solid rgba(184,151,42,0.2)",
                        bgcolor: isSelected ? GOLD_LIGHT : "#fff",
                        boxShadow: isSelected ? `0 4px 16px ${GOLD}25` : "none",
                        transition: "all 0.2s",
                        "&:hover": { borderColor: GOLD, bgcolor: GOLD_BG },
                      }}
                    >
                      <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: isSelected ? GOLD_DARK : TEXT_MID, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {dt.toLocaleString("default", { weekday: "short" })}
                      </Typography>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: isSelected ? GOLD_DARK : TEXT_DARK, lineHeight: 1.2 }}>
                        {dt.getDate()}
                      </Typography>
                      <Typography sx={{ fontSize: "0.62rem", color: isSelected ? GOLD : "#22c55e", fontWeight: 600 }}>
                        {available} free
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <EventAvailableIcon sx={{ fontSize: 36, color: `${GOLD}55`, mb: 1 }} />
                <Typography sx={{ color: TEXT_MID, fontSize: "0.88rem" }}>No available days this month.</Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Time slots ── */}
        {selectedDay && (
          <Box
            sx={{
              borderRadius: 3, border: `1px solid ${BORDER_CLR}`,
              bgcolor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              mb: 3, overflow: "hidden",
            }}
          >
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${GOLD}15`, bgcolor: GOLD_BG, display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon sx={{ color: GOLD, fontSize: 18 }} />
              <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: TEXT_DARK }}>
                Available Times — {new Date(selectedDay).toLocaleDateString("default", { weekday: "long", month: "short", day: "numeric" })}
              </Typography>
            </Box>

            <Box sx={{ px: 3, py: 2, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {groupedByDay[selectedDay].map((slot) => {
                const isBooked = slot.isBooked;
                const isSelected = selectedAvailability.toString() === slot.id.toString();
                return (
                  <Box
                    key={slot.id}
                    onClick={() => !isBooked && setSelectedAvailability(slot.id)}
                    sx={{
                      cursor: isBooked ? "not-allowed" : "pointer",
                      px: 2, py: 1.2, borderRadius: 2.5,
                      border: isSelected
                        ? `2px solid ${GOLD}`
                        : isBooked
                          ? "1.5px dashed rgba(0,0,0,0.15)"
                          : "1.5px solid rgba(184,151,42,0.2)",
                      bgcolor: isSelected ? GOLD_LIGHT : isBooked ? "#f9f9f9" : "#fff",
                      opacity: isBooked ? 0.55 : 1,
                      boxShadow: isSelected ? `0 4px 14px ${GOLD}25` : "none",
                      display: "flex", alignItems: "center", gap: 1,
                      transition: "all 0.2s",
                      "&:hover": !isBooked ? { borderColor: GOLD, bgcolor: GOLD_BG } : {},
                    }}
                  >
                    {isSelected && <CheckCircleOutlineIcon sx={{ color: GOLD, fontSize: 16 }} />}
                    <Typography sx={{
                      fontSize: "0.85rem", fontWeight: 700,
                      color: isSelected ? GOLD_DARK : isBooked ? "rgba(74,74,106,0.4)" : TEXT_DARK,
                    }}>
                      {fmtTime(slot.startTime)} – {fmtTime(slot.endTime)}
                    </Typography>
                    {isBooked && (
                      <Box sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#991b1b", bgcolor: "#fee2e2", borderRadius: 50, px: 1 }}>
                        Booked
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ── Confirm button ── */}
        {selectedDay && (
          <Button
            fullWidth
            disabled={!selectedAvailability || submitting}
            onClick={handleSubmit}
            sx={{
              py: 1.6, borderRadius: 50, fontWeight: 700, fontSize: "1rem",
              textTransform: "none",
              background: !selectedAvailability || submitting
                ? `${GOLD}55`
                : `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
              color: "white",
              boxShadow: selectedAvailability ? `0 6px 24px ${GOLD}40` : "none",
              "&:hover:not(:disabled)": {
                background: GOLD_DARK,
                transform: "translateY(-2px)",
                boxShadow: `0 10px 32px ${GOLD}55`,
              },
              transition: "all 0.30s",
            }}
          >
            {submitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CircularProgress size={18} sx={{ color: "rgba(255,255,255,.8)" }} />
                <span>Booking…</span>
              </Box>
            ) : "Confirm Appointment"}
          </Button>
        )}
      </Box>
    </>
  );

  return (
    <>
{isDialog === true ? (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: "#f9f8f5", p: 1 } }}>
          <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
            {innerContent}
          </DialogContent>
        </Dialog>
      ) : isDialog === "embedded" ? (
        <Box sx={{ width: "100%", maxWidth: 640, mx: "auto", animation: "0.3s ease-in-out fadeIn" }}>
          {innerContent}
        </Box>
      ) : (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f9f8f5", py: 5, px: { xs: 2, sm: 4 }, fontFamily: "'Inter', sans-serif" }}>
          <Box sx={{ maxWidth: 560, mx: "auto" }}>
            {innerContent}
          </Box>
        </Box>
      )}
    </>
  );
}
