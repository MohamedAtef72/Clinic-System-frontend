import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import { getStatusChipColor } from "../../../components/GetStatus";

export const AppointmentsReviewTable = ({ appointments, onShowRate }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
      <Table sx={{ minWidth: 900 }}>
        <TableHead sx={{ "& .MuiTableCell-root": { bgcolor: "grey.100" } }}>
          <TableRow>
            <TableCell>Doctor</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Rating</TableCell>
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
                {a.startTime ? new Date(a.startTime).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell>
                {a.startTime
                  ? new Date(a.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "N/A"}
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
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onShowRate(a.id)}
                  disabled={a.appointmentStatus !== "Completed"}
                >
                  Show Rate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};