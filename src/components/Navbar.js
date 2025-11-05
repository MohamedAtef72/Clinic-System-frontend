import React, { useState } from "react";
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Link
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  let navItems = [];

  if (isAuthenticated) {
    navItems = [
      { text: "Profile", path: "/profile" },
      { text: "Doctors", path: "/doctors" },
      ...(user?.role === "Admin"
        ? [
            { text: "Dashboard", path: "/admin/dash" },
            { text: "AddDoctor", path: "/doctor-register" },
            { text: "AddReceptionist", path: "/receptionist-register" },
            { text: "AllAppointments", path: "/all-appointments" },
            { text: "AddSpeciality", path: "/add-speciality" },
          ]
        : []),
      ...(user?.role === "Receptionist"
        ? [{ text: "AddPatient", path: "/patient-register" },
            { text: "AllAppointments", path: "/Receptionist/all-appointments" }
        ]
        : []),
      ...(user?.role === "Doctor"
        ? [{ text: "Schedule", path: "/doctor-schedule" } , { text: "My Appointments", path: "/doctor-appointments" }]
        : []),
      ...(user?.role === "Patient"
        ? [{text: "My Appointments", path: "/patient-appointments"}]
        : []),
      { text: "Logout", path: "/", isLogout: true },
    ];
  } else {
    navItems = [
      { text: "Login", path: "/login" },
      { text: "Register as Patient", path: "/patient-register" },
    ];
  }

  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            <Link href="/" underline="none" color="white">MedClinic Pro</Link>
          </Typography>

          <IconButton size="large" edge="end" color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {navItems.map((item) =>
              item.isLogout ? (
                <MenuItem key={item.text} onClick={() => { handleMenuClose(); handleLogout(); }}>
                  {item.text}
                </MenuItem>
              ) : (
                <MenuItem key={item.text}  onClick={() => {handleMenuClose(); navigate(item.path);}}>
                  {item.text}
                </MenuItem>
              )
            )}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
