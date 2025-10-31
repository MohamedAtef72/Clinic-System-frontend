import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getStatusChipColor } from "./GetStatus"; 

// A sub-component to handle the complex action buttons logic
const TableActions = ({ appointment, onAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    onAction(appointment, action);
    handleMenuClose();
  };

  // Define all possible actions
  const actions = {
    checkIn: {
      label: "Check-In",
      action: "CheckedIn",
      color: "success",
      disabled: appointment.appointmentStatus === "CheckedIn",
    },
    cancel: {
      label: "Cancel",
      action: "Cancelled",
      color: "error",
      disabled: appointment.appointmentStatus === "Cancelled",
    },
    noShow: {
      label: "No-Show",
      action: "NoShow",
      color: "warning",
      disabled: appointment.appointmentStatus === "NoShow",
    },
    complete: {
      label: "Complete",
      action: "Completed",
      color: "info",
      disabled: appointment.appointmentStatus === "Completed",
    },
  };

  // Determine the primary action and secondary actions
  let primaryAction = null;
  let secondaryActions = [];

  if (appointment.appointmentStatus === "Confirmed") {
    primaryAction = actions.checkIn;
    secondaryActions = [actions.cancel, actions.noShow];
  } else if (appointment.appointmentStatus === "CheckedIn") {
    primaryAction = actions.complete;
    secondaryActions = [actions.cancel, actions.noShow];
  } else {
    // Default case: put all non-disabled actions in the menu
    secondaryActions = Object.values(actions).filter((act) => !act.disabled);
  }

  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      {primaryAction && (
        <Button
          size="small"
          variant="contained"
          color={primaryAction.color}
          onClick={() => handleAction(primaryAction.action)}
          disabled={primaryAction.disabled}
        >
          {primaryAction.label}
        </Button>
      )}

      {secondaryActions.length > 0 && (
        <>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            {secondaryActions.map((btn) => (
              <MenuItem
                key={btn.action}
                onClick={() => handleAction(btn.action)}
                disabled={btn.disabled}
              >
                {btn.label}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Stack>
  );
};

export const AppointmentsTable = ({ appointments, onAction }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead sx={{ "& .MuiTableCell-root": { bgcolor: "grey.100" } }}>
          <TableRow>
            <TableCell>Doctor</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((a) => (
            <TableRow
              key={a.id}
              sx={{
                "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell sx={{ fontWeight: 500 }}>Dr. {a.doctorName}</TableCell>
              <TableCell>{a.patientName}</TableCell>
              <TableCell>
                {a.startTime
                  ? new Date(a.startTime).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                {a.startTime
                  ? new Date(a.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "success.dark" }}>
                {a.doctorPrice} EGP
              </TableCell>
              <TableCell>
                <Chip
                  label={a.appointmentStatus}
                  color={getStatusChipColor(a.appointmentStatus)}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
              <TableCell align="center">
                <TableActions appointment={a} onAction={onAction} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};