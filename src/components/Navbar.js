import React, { useState } from "react";
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Link, Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import NotificationsIcon from '@mui/icons-material/Notifications';



export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead, refreshNotifications, loading } = useNotifications();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    refreshNotifications();
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

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
        ? [{ text: "Schedule", path: "/doctor-schedule" }, { text: "My Appointments", path: "/doctor-appointments" }]
        : []),
      ...(user?.role === "Patient"
        ? [{ text: "My Appointments", path: "/patient-appointments" }]
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            <Link href="/" underline="none" color="white">MedClinic Pro</Link>
          </Typography>

          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleNotificationOpen}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              style: {
                maxHeight: 400,
                width: '350px',
                overflowY: 'auto',
              },
            }}
          >
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
              <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
              {unreadCount > 0 && (
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  onClick={markAllNotificationsAsRead}
                >
                  Mark all as read
                </Typography>
              )}
            </Box>
            {notifications.length === 0 && !loading ? (
              <MenuItem onClick={handleNotificationClose}>No Notifications</MenuItem>
            ) : (
              notifications.map((n, i) => (
                <MenuItem
                  key={n.id || i}
                  onClick={() => {
                    if (!n.isRead) markNotificationAsRead(n.id);
                  }}
                  divider
                  sx={{
                    backgroundColor: n.isRead ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                    whiteSpace: 'normal',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 0.5,
                    py: 1.5
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2" fontWeight={n.isRead ? 'normal' : 'bold'}>
                      {n.title}
                    </Typography>
                    {n.createdAt && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                    {n.message}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ alignSelf: 'flex-end', fontSize: '0.7rem' }}>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </Typography>
                </MenuItem>
              ))
            )}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <Typography variant="caption">Loading...</Typography>
              </Box>
            )}
            {/* Show All button */}
            <Box sx={{ p: 1, borderTop: '1px solid #eee' }}>
              <MenuItem
                id="show-all-notifications-btn"
                onClick={() => {
                  handleNotificationClose();
                  navigate('/notifications');
                }}
                sx={{
                  justifyContent: 'center',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderRadius: 1,
                  '&:hover': { backgroundColor: 'rgba(25,118,210,0.08)' },
                }}
              >
                Show All Notifications
              </MenuItem>
            </Box>
          </Menu>

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
                <MenuItem key={item.text} onClick={() => { handleMenuClose(); navigate(item.path); }}>
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
