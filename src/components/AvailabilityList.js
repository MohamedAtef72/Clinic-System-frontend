import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Collapse,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function AvailabilityList({ data, onDelete, onEdit }) {
  const [openDay, setOpenDay] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  if (!data.length)
    return <p style={{ textAlign: "center" }}>No slots found.</p>;

  // Group data by date
  const groupedByDate = data.reduce((groups, slot) => {
    const date = new Date(slot.startTime).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(slot);
    return groups;
  }, {});

  const handleToggle = (day) => {
    setOpenDay(openDay === day ? null : day);
  };

  // Open edit dialog and set current slot
  const handleOpenEditDialog = (slot) => {
      setCurrentSlot(slot);

      const startDate = new Date(slot.startTime);
      const endDate = new Date(slot.endTime);

      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      setNewStart(formatTime(startDate));
      setNewEnd(formatTime(endDate));
      setEditDialogOpen(true);
  };

  // Close edit dialog and reset state
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentSlot(null);
    setNewStart("");
    setNewEnd("");
  };

  // Save edited slot
  const handleSaveEdit = () => {
    if (!currentSlot) return;
    
    if (!newStart || !newEnd) {
      alert("Please enter both start and end times.");
      return;
    }

    const updatedData = {
      startTime: `${new Date(currentSlot.startTime)
        .toISOString()
        .split("T")[0]}T${newStart}`,
      endTime: `${new Date(currentSlot.endTime)
        .toISOString()
        .split("T")[0]}T${newEnd}`,
    };

    onEdit(currentSlot, updatedData);
    handleCloseEditDialog();
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Slots Count</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.keys(groupedByDate).map((day) => (
            <React.Fragment key={day}>
              {/* Main Row for each day */}
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">{day}</Typography>
                </TableCell>
                <TableCell>{groupedByDate[day].length}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleToggle(day)}>
                    {openDay === day ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Collapsible section for the day */}
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                  <Collapse in={openDay === day} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {groupedByDate[day].map((a) => (
                            <TableRow key={a.id}>
                              <TableCell>
                                {new Date(a.startTime).toLocaleTimeString()}
                              </TableCell>
                              <TableCell>
                                {new Date(a.endTime).toLocaleTimeString()}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={a.isBooked ? "Booked" : "Available"}
                                  color={a.isBooked ? "error" : "success"}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleOpenEditDialog(a)}>
                                  <EditIcon color="primary" />
                                </IconButton>
                                <IconButton onClick={() => onDelete(a.id)}>
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for editing */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Availability Slot</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Time"
              type="time"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}