import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, IconButton, Menu, MenuItem
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getStatusChipColor } from "../../../components/GetStatus";

const ActionsMenu = ({ appointment, onAddNotes, onShowNotes, onShowRate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isVisitAddActive = appointment.appointmentStatus === "CheckedIn";
  const isVisitUpdateActive = appointment.appointmentStatus === "Completed";


  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={() => onAddNotes(appointment.visitId, appointment.id)}
        disabled={!isVisitAddActive}
        sx={{ mr: 1 }}
      >
        Add Notes
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => onAddNotes(appointment.visitId, appointment.id)}
        disabled={!isVisitUpdateActive}
        sx={{ mr: 1 }}
      >
        Update Notes
      </Button>
      <IconButton size="small" onClick={handleOpenMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem onClick={() => { onShowNotes(appointment.visitId); handleCloseMenu(); }} disabled={!appointment.visitId}>
          View Notes
        </MenuItem>
        <MenuItem onClick={() => { onShowRate(appointment.id); handleCloseMenu(); }} disabled={appointment.appointmentStatus !== 'Completed'}>
          View Rating
        </MenuItem>
      </Menu>
    </>
  );
};

export const DoctorAppointmentsTable = ({ appointments, onAddNotes, onShowNotes, onShowRate }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead sx={{ "& .MuiTableCell-root": { bgcolor: "grey.100" } }}>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((a) => (
            <TableRow key={a.id} sx={{ "&:nth-of-type(odd)": { bgcolor: "action.hover" } }}>
              <TableCell sx={{ fontWeight: 500 }}>{a.patientName}</TableCell>
              <TableCell>{a.startTime ? new Date(a.startTime).toLocaleDateString() : "N/A"}</TableCell>
              <TableCell>{a.startTime ? new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</TableCell>
              <TableCell>
                <Chip label={a.appointmentStatus} color={getStatusChipColor(a.appointmentStatus)} size="small" sx={{ fontWeight: 500 }} />
              </TableCell>
              <TableCell align="center">
                <ActionsMenu appointment={a} onAddNotes={onAddNotes} onShowNotes={onShowNotes} onShowRate={onShowRate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};