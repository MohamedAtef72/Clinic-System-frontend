import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import {
  getDoctorById,
  createAppointment,
  currentUser,
} from "../../../services/authService";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  CircularProgress,
  Alert,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [groupedByDay, setGroupedByDay] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [patientId, setPatientId] = useState(null);
  const navigate = useNavigate();

  // Current month for filtering
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // time slot generation with recurrence handling
  const generateRecurringAvailabilities = (availabilities) => {
    const allSlots = [];

    availabilities.forEach((a) => {
      allSlots.push({
        ...a,
        originalId: a.id, // حفظ الـ id الأصلي
      });

      if (a.recurrencePattern && a.recurrenceEndDate) {
        let start = new Date(a.startTime);
        let end = new Date(a.endTime);
        const recurrenceEnd = new Date(a.recurrenceEndDate);

        while (true) {
          start.setDate(start.getDate() + 7); // تكرار أسبوعي
          end.setDate(end.getDate() + 7);
          if (start > recurrenceEnd) break;

          allSlots.push({
            ...a,
            id: `${a.id}-${start.toISOString()}`,
            originalId: a.id, // نحفظ الأصل
            startTime: new Date(start),
            endTime: new Date(end),
          });
        }
      }
    });

    return allSlots;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorRes, userRes] = await Promise.all([
          getDoctorById(doctorId),
          currentUser(),
        ]);

        setDoctor(doctorRes);
        setPatientId(userRes.user?.id || userRes.userId);

        // 🧠 توليد المواعيد (مع التكرار)
        const generatedSlots = generateRecurringAvailabilities(
          doctorRes.availabilities || []
        );
        setAvailabilities(generatedSlots);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load doctor or availabilities data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  // filter and group by day whenever availabilities or month changes
  useEffect(() => {
    if (availabilities.length === 0) return;

    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();

    const filtered = availabilities.filter((a) => {
      const d = new Date(a.startTime);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const grouped = {};
    filtered.forEach((a) => {
      const dateKey = new Date(a.startTime).toISOString().split("T")[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(a);
    });
    setGroupedByDay(grouped);
    setSelectedDay("");
  }, [availabilities, currentMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAvailability) {
      setMessage("Please select a time slot before confirming.");
      return;
    }

    try {
      const selectedSlot = availabilities.find(
        (a) => a.id.toString() === selectedAvailability.toString()
      );

      if (!selectedSlot) {
        setMessage("Selected slot not found. Please try again.");
        return;
      }
      const dto = {
        patientId,
        availabilityId: selectedSlot.originalId,
        date: selectedSlot.startTime,
        appointmentStatus:"Schedule"
      };

      const res = await createAppointment(dto);
      setMessage(res.message || "Appointment booked successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create appointment.");
    }
  };

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

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (!doctor) return <Alert severity="error">Doctor not found</Alert>;

  const days = Object.keys(groupedByDay);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ p: 3, width: 500 }}>
        <Avatar
          src={doctor.imagePath || "/default-doctor.png"}
          alt={doctor.userName}
          sx={{ width: 100, height: 100, mx: "auto" }}
        />
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            {doctor.userName}
          </Typography>
          <Typography color="text.secondary">
            {doctor.specialityName}
          </Typography>
          <Typography color="text.secondary">{doctor.country}</Typography>
          <Typography >Price: {doctor.consulationPrice}</Typography>
        </CardContent>

        <Divider sx={{ my: 2 }} />

        {/* month buttons */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Button onClick={handlePreviousMonth}>Previous</Button>
          <Typography variant="h6">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
          <Button onClick={handleNextMonth}>Next</Button>
        </Stack>

        <Typography variant="h6">Available Days</Typography>
        {days.length > 0 ? (
          <List>
            {days.map((day) => (
              <ListItemButton
                key={day}
                selected={selectedDay === day}
                onClick={() => {
                  setSelectedDay(day);
                  setSelectedAvailability("");
                }}
              >
                <ListItemText primary={new Date(day).toDateString()} />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">
            No available days this month.
          </Typography>
        )}

        {selectedDay && (
          <>
            <Divider sx={{ my: 2 }} />
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Available Times for {new Date(selectedDay).toDateString()}
              </FormLabel>
              <RadioGroup
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
              >
                {groupedByDay[selectedDay].map((slot) => (
                  <Box
                    key={slot.id}
                    sx={{
                      opacity: slot.isBooked ? 0.5 : 1,
                      border:
                        slot.isBooked && "1px dashed rgba(0,0,0,0.3)",
                      borderRadius: 2,
                      mb: 1,
                      p: 1,
                    }}
                  >
                    <FormControlLabel
                      value={slot.id}
                      control={<Radio />}
                      label={`${new Date(slot.startTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )} - ${new Date(slot.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} ${slot.isBooked ? "(Booked)" : ""}`}
                      disabled={slot.isBooked}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleSubmit}
              disabled={!selectedAvailability}
            >
              Confirm Appointment
            </Button>
          </>
        )}

        {message && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Card>
    </Box>
  );
}
