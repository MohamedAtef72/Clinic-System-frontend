import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, IconButton, Menu, MenuItem, Box, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getStatusStyle } from "../../../components/GetStatus";

import { GOLD, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
const ActionsMenu = ({ appointment, onAddNotes, onShowNotes, onShowRate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isVisitAddActive = appointment.appointmentStatus === "CheckedIn";
  const isVisitUpdateActive = appointment.appointmentStatus === "Completed";

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "flex-end" }}>
      <Button
        variant="contained" size="small"
        onClick={() => onAddNotes(appointment.visitId, appointment.id)}
        disabled={!isVisitAddActive}
        sx={{ borderRadius: 50, minWidth: 90, px: 2, fontWeight: 600, textTransform: "none", bgcolor: GOLD, "&:hover": { bgcolor: GOLD_DARK }, boxShadow: `0 4px 12px ${GOLD}30` }}
      >
        Add Notes
      </Button>
      <Button
        variant="outlined" size="small"
        onClick={() => onAddNotes(appointment.visitId, appointment.id)}
        disabled={!isVisitUpdateActive}
        sx={{ borderRadius: 50, minWidth: 90, px: 2, fontWeight: 600, textTransform: "none", color: GOLD_DARK, borderColor: `${GOLD}60`, "&:hover": { bgcolor: "#fdf8ec", borderColor: GOLD } }}
      >
        Edit Notes
      </Button>
      
      <IconButton size="small" onClick={handleOpenMenu} sx={{ color: TEXT_MID, "&:hover": { color: GOLD, bgcolor: "#fdf8ec" } }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      
      <Menu 
        anchorEl={anchorEl} open={open} onClose={handleCloseMenu} 
        sx={{ "& .MuiPaper-root": { borderRadius: 3, border: `1px solid ${GOLD}20`, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" } }}
      >
        <MenuItem onClick={() => { onShowNotes(appointment.visitId); handleCloseMenu(); }} disabled={!appointment.visitId} sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
          View Notes
        </MenuItem>
        <MenuItem onClick={() => { onShowRate(appointment.id); handleCloseMenu(); }} disabled={appointment.appointmentStatus !== 'Completed'} sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
          View Rating
        </MenuItem>
      </Menu>
    </Box>
  );
};

export const DoctorAppointmentsTable = ({ appointments, onAddNotes, onShowNotes, onShowRate }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: `1px solid rgba(184,151,42,0.15)`, boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead sx={{ bgcolor: "#fcfaf5" }}>
          <TableRow>
            <TableCell sx={{ color: TEXT_MID, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", py: 2.5 }}>Patient</TableCell>
            <TableCell sx={{ color: TEXT_MID, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</TableCell>
            <TableCell sx={{ color: TEXT_MID, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Time</TableCell>
            <TableCell sx={{ color: TEXT_MID, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</TableCell>
            <TableCell align="right" sx={{ color: TEXT_MID, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((a) => {
            const statusStyle = getStatusStyle(a.appointmentStatus);
            const patientInitials = a.patientName !== "N/A" ? a.patientName.substring(0, 2).toUpperCase() : "?";

            return (
              <TableRow key={a.id} sx={{ transition: "all 0.2s", "&:hover": { bgcolor: "rgba(184,151,42,0.02)" } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: "#fdf8ec", color: GOLD_DARK, fontWeight: 700, fontSize: "0.85rem", border: `1px solid ${GOLD}40` }}>
                      {patientInitials}
                    </Avatar>
                    <Box sx={{ fontWeight: 600, color: TEXT_DARK }}>{a.patientName}</Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: TEXT_MID, fontWeight: 500 }}>
                  {a.startTime ? new Date(a.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : "N/A"}
                </TableCell>
                <TableCell sx={{ color: TEXT_MID, fontWeight: 500 }}>
                  {a.startTime ? new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                </TableCell>
                <TableCell>
                  <Chip label={a.appointmentStatus} size="small" sx={{ fontWeight: 700, fontSize: "0.7rem", height: 24, backgroundColor: statusStyle.bgcolor, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }} />
                </TableCell>
                <TableCell align="right">
                  <ActionsMenu appointment={a} onAddNotes={onAddNotes} onShowNotes={onShowNotes} onShowRate={onShowRate} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};