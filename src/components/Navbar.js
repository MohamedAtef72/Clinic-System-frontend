import React, { useState, useEffect } from "react";
import {
  Box, Toolbar, IconButton, Typography, Menu, MenuItem, Badge,
  Divider, Chip, Avatar, Button, InputBase, Collapse, useTheme, useMediaQuery} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { userProfile } from '../services/userService';

import { GOLD, GOLD_DARK, GOLD_LIGHT, NAV_BG, NAV_BG_SCROLLED, TEXT_DARK, TEXT_MID } from "../theme/tokens";

export default function Navbar() {
  const [userData, setUserData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshNotifications,
    loading,
  } = useNotifications();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const res = await userProfile();
          setUserData(res.user);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        }
      } else {
        setUserData(null);
      }
    };
    fetchProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate("/");
  };

  /** Navigate to a route or smooth-scroll to an anchor (#id). */
  const handleNavClick = (path) => {
    setAnchorEl(null);
    if (path.startsWith("#")) {
      const id = path.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Not on home page yet — go there first, then scroll
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } else {
      navigate(path);
    }
  };


  /* nav items per role */
  let navItems = [];
  if (isAuthenticated) {
    navItems = [
      { text: "Profile", path: "/profile" },
      { text: "Doctors", path: "/doctors" },
      ...(user?.role === "Admin"
        ? [
          { text: "Dashboard", path: "/admin/dash" },
          { text: "Add Doctor", path: "/doctor-register" },
          { text: "Add Receptionist", path: "/receptionist-register" },
          { text: "All Appointments", path: "/all-appointments" },
          { text: "Add Speciality", path: "/add-speciality" },
        ]
        : []),
      ...(user?.role === "Receptionist"
        ? [
          { text: "Add Patient", path: "/patient-register" },
          { text: "All Appointments", path: "/Receptionist/all-appointments" },
        ]
        : []),
      ...(user?.role === "Doctor"
        ? [
          { text: "Schedule", path: "/doctor-schedule" },
          { text: "My Appointments", path: "/doctor-appointments" },
        ]
        : []),
      ...(user?.role === "Patient"
        ? [{ text: "My Appointments", path: "/patient-appointments" }]
        : []),
      { text: "Logout", path: "/", isLogout: true },
    ];
  } else {
    navItems = [
      { text: "Home", path: "#home" },
      { text: "About Us", path: "#about" },
      { text: "Contact", path: "#contact" },
    ];
  }

  /* centre pill links (subset for authenticated) */
  const centreLinks = isAuthenticated
    ? navItems.filter((i) =>
      ["Profile", "Doctors", "Dashboard", "My Appointments", "Schedule", "All Appointments"].includes(i.text)
    ).slice(0, 5)
    : navItems.filter((i) => !i.isLogout && i.text !== "Login" && i.text !== "Register");

  return (
    <>
      <style>{`
        @keyframes navIn { from { transform:translateY(-100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes badgeBeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
        @keyframes searchSlide { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }
      `}</style>

      {/* ── fixed spacer ── */}
      <Box sx={{ height: { xs: 64, md: 72 } }} />

      {/* ══════════════ NAVBAR ══════════════ */}
      <Box
        component="nav"
        sx={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 1300,
          background: scrolled ? NAV_BG_SCROLLED : NAV_BG,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${scrolled ? "rgba(184,151,42,0.2)" : "rgba(184,151,42,0.1)"}`,
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
          transition: "box-shadow 0.35s ease, border-color 0.35s ease",
          animation: "navIn 0.5s ease forwards",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, md: 72 },
            px: { xs: 2, md: 4 },
            gap: 2,
          }}
        >
          {/* ── Logo ── */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex", alignItems: "center", gap: 1.2,
              cursor: "pointer", flexShrink: 0,
              "&:hover .logo-name": { color: GOLD },
            }}
          >
            <LocalHospitalIcon
              sx={{
                color: GOLD, fontSize: 30,
                filter: `drop-shadow(0 2px 6px ${GOLD}55)`,
              }}
            />
            <Box>
              <Typography
                className="logo-name"
                sx={{
                  fontWeight: 800, fontSize: "1.05rem",
                  color: TEXT_DARK, lineHeight: 1.1,
                  letterSpacing: "-0.3px",
                  transition: "color 0.25s",
                }}
              >
                MedClinic
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.6rem", fontWeight: 600,
                  color: GOLD, letterSpacing: "1.5px",
                  textTransform: "uppercase", lineHeight: 1,
                }}
              >
                Professional Care
              </Typography>
            </Box>
          </Box>

          {/* ── Centre pill navigation ── */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
                background: "#f7f5ef",
                border: "1px solid rgba(184,151,42,0.15)",
                borderRadius: 50,
                px: 1,
                py: 0.6,
              }}
            >
              {centreLinks.map((item) => (
                <Box
                  key={item.text}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    px: 2.2, py: 0.7,
                    borderRadius: 50,
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: TEXT_MID,
                    whiteSpace: "nowrap",
                    transition: "all 0.22s",
                    "&:hover": {
                      background: GOLD_LIGHT,
                      color: GOLD_DARK,
                      fontWeight: 600,
                    },
                  }}
                >
                  {item.text}
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Right side ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>

            {/* Search toggle */}
            <IconButton
              onClick={() => setSearchOpen((v) => !v)}
              sx={{
                color: TEXT_MID,
                "&:hover": { color: GOLD, bgcolor: GOLD_LIGHT },
                transition: "all 0.2s",
              }}
            >
              {searchOpen ? <CloseIcon fontSize="small" /> : <SearchIcon fontSize="small" />}
            </IconButton>

            {/* Notifications */}
            {isAuthenticated && (
              <IconButton
                onClick={(e) => { setNotifAnchorEl(null); refreshNotifications(); setNotifAnchorEl(e.currentTarget); }}
                sx={{
                  color: TEXT_MID,
                  "&:hover": { color: GOLD, bgcolor: GOLD_LIGHT },
                  transition: "all 0.2s",
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                      color: "white",
                      fontSize: "0.6rem",
                      minWidth: 16, height: 16,
                      animation: unreadCount > 0 ? "badgeBeat 2s ease-in-out infinite" : "none",
                    },
                  }}
                >
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            )}

            {/* Login/User button */}
            {isAuthenticated ? (
              <Chip
                avatar={
                  <Avatar
                    sx={{
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                      color: "white",
                      width: 26, height: 26,
                      fontSize: "0.7rem", fontWeight: 700,
                    }}
                  >
                    {userData?.userName?.[0]?.toUpperCase() || user?.role?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                }
                label={userData?.userName?.split(" ")[0] || user?.role}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  background: GOLD_LIGHT,
                  border: `1px solid ${GOLD}40`,
                  color: GOLD_DARK,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: { xs: "none", md: "flex" },
                  "&:hover": { background: `${GOLD}22` },
                  transition: "all 0.2s",
                }}
              />
            ) : (
              <>
                {/* Desktop login / register buttons */}
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    px: 2.5, py: 0.9,
                    borderRadius: 50,
                    textTransform: "none",
                    boxShadow: `0 4px 16px ${GOLD}44`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${GOLD_DARK}, #7a6015)`,
                      transform: "translateY(-1px)",
                      boxShadow: `0 6px 20px ${GOLD}55`,
                    },
                    transition: "all 0.25s",
                  }}
                  startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/patient-register")}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    px: 2.5, py: 0.9,
                    borderRadius: 50,
                    textTransform: "none",
                    boxShadow: `0 4px 16px ${GOLD}44`,
                    "&:hover": {
                      background: `linear-gradient(135deg, ${GOLD_DARK}, #7a6015)`,
                      transform: "translateY(-1px)",
                      boxShadow: `0 6px 20px ${GOLD}55`,
                    },
                    transition: "all 0.25s",
                  }}
                  startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
                >
                  Register
                </Button>

                {/* Mobile-only login Avatar for guests */}
                <IconButton
                  onClick={() => navigate("/login")}
                  sx={{
                    display: { xs: "flex", md: "none" },
                    p: 0.5,
                    "&:hover": { bgcolor: GOLD_LIGHT },
                    transition: "all 0.2s",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 34, height: 34,
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                      boxShadow: `0 3px 10px ${GOLD}55`,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 18, color: "white" }} />
                  </Avatar>
                </IconButton>
              </>
            )}

            {/* Hamburger – always on mobile, desktop only when authenticated */}
            {(isMobile) && (
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  color: TEXT_MID,
                  border: `1px solid rgba(184,151,42,0.25)`,
                  borderRadius: 2,
                  p: 0.8,
                  display: isAuthenticated
                    ? "flex"                        // authenticated → always visible
                    : { xs: "flex", md: "none" },   // guest → mobile only
                  "&:hover": { bgcolor: GOLD_LIGHT, borderColor: GOLD },
                  transition: "all 0.2s",
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* ── Inline search bar ── */}
        <Collapse in={searchOpen} timeout={280}>
          <Box
            sx={{
              px: { xs: 2, md: 4 }, pb: 1.5,
              display: "flex", alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                flex: 1, display: "flex", alignItems: "center",
                background: "#f7f5ef",
                border: `1px solid ${GOLD}40`,
                borderRadius: 50,
                px: 2, py: 0.6,
                maxWidth: 480,
                mx: "auto",
                animation: "searchSlide 0.28s ease",
                transformOrigin: "center",
              }}
            >
              <SearchIcon sx={{ color: GOLD, mr: 1, fontSize: 18 }} />
              <InputBase
                autoFocus
                placeholder="Search doctors, specialties, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                sx={{
                  flex: 1,
                  fontSize: "0.9rem",
                  color: TEXT_DARK,
                  "& ::placeholder": { color: "#aaa" },
                }}
              />
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* ══════════════ NOTIFICATION MENU ══════════════ */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={() => setNotifAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1.5, width: 360, maxHeight: 450,
            borderRadius: 3,
            border: `1px solid ${GOLD}22`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            overflow: "hidden",
          },
        }}
      >
        {/* header */}
        <Box
          sx={{
            px: 2.5, py: 2,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: `1px solid ${GOLD}20`,
            background: GOLD_LIGHT,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationsIcon sx={{ color: GOLD, fontSize: 18 }} />
            <Typography fontWeight={700} fontSize="0.95rem" color={TEXT_DARK}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                sx={{
                  height: 18, fontSize: "0.62rem", fontWeight: 700,
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                  color: "white",
                  "& .MuiChip-label": { px: 0.8 },
                }}
              />
            )}
          </Box>
          {unreadCount > 0 && (
            <Typography
              variant="caption"
              sx={{
                color: GOLD, cursor: "pointer", fontWeight: 600,
                "&:hover": { textDecoration: "underline" }
              }}
              onClick={markAllNotificationsAsRead}
            >
              Mark all read
            </Typography>
          )}
        </Box>

        {/* items */}
        <Box sx={{ overflowY: "auto", maxHeight: 320 }}>
          {loading ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">Loading…</Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <NotificationsIcon sx={{ fontSize: 36, color: `${GOLD}44`, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
            </Box>
          ) : (
            notifications.map((n, i) => (
              <MenuItem
                key={n.id || i}
                onClick={() => { if (!n.isRead) markNotificationAsRead(n.id); }}
                sx={{
                  borderLeft: n.isRead ? "3px solid transparent" : `3px solid ${GOLD}`,
                  bgcolor: n.isRead ? "transparent" : `${GOLD}08`,
                  flexDirection: "column", alignItems: "flex-start",
                  whiteSpace: "normal", gap: 0.4, py: 1.5, px: 2.5,
                  "&:hover": { bgcolor: GOLD_LIGHT },
                  transition: "background 0.2s",
                }}
              >
                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" fontWeight={n.isRead ? 500 : 700} fontSize="0.82rem">
                    {n.title}
                  </Typography>
                  {n.createdAt && (
                    <Typography variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word", fontSize: "0.8rem" }}>
                  {n.message}
                </Typography>
              </MenuItem>
            ))
          )}
        </Box>

        {/* footer */}
        <Box sx={{ borderTop: `1px solid ${GOLD}20`, p: 1 }}>
          <MenuItem
            id="show-all-notifications-btn"
            onClick={() => { setNotifAnchorEl(null); navigate("/notifications"); }}
            sx={{
              justifyContent: "center", color: GOLD,
              fontWeight: 700, fontSize: "0.82rem",
              borderRadius: 2,
              "&:hover": { bgcolor: GOLD_LIGHT },
            }}
          >
            View all notifications →
          </MenuItem>
        </Box>
      </Menu>

      {/* ══════════════ HAMBURGER MENU ══════════════ */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1.5, minWidth: 240,
            borderRadius: 3,
            border: `1px solid ${GOLD}22`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            overflow: "hidden",
          },
        }}
      >
        {/* User header */}
        {isAuthenticated && [
          <Box
            key="user-header"
            sx={{
              px: 2.5, py: 2,
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, #fdf8e8)`,
              display: "flex", alignItems: "center", gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 42, height: 42,
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                fontSize: "1rem", fontWeight: 700,
                boxShadow: `0 4px 12px ${GOLD}44`,
              }}
            >
              {userData?.userName?.[0]?.toUpperCase() || user?.role?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography fontWeight={700} fontSize="0.9rem" color={TEXT_DARK} lineHeight={1.2}>
                {userData?.userName || "User"}
              </Typography>
              <Typography fontSize="0.72rem" color={GOLD} fontWeight={600}>
                {user?.role}
              </Typography>
            </Box>
          </Box>,
          <Divider key="user-header-divider" sx={{ borderColor: `${GOLD}20` }} />,
        ]}

        {navItems.map((item) =>
          item.isLogout ? [
            <Divider key={`divider-${item.text}`} sx={{ borderColor: `${GOLD}15`, my: 0.5 }} />,
            <MenuItem
              key={item.text}
              onClick={handleLogout}
              sx={{
                color: "#e53935", fontWeight: 600, gap: 1.5,
                py: 1.2, px: 2.5, mx: 1, mb: 0.5, borderRadius: 5, transition: "all 0.2s",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.9)", transform: "translateX(4px)" },
              }}
            >
              <LogoutIcon fontSize="small" />
              {item.text}
            </MenuItem>
          ] : (
            <MenuItem
              key={item.text}
              onClick={() => handleNavClick(item.path)}
              sx={{
                py: 1.2, px: 2.5, mx: 1, mt: 0.5,
                borderRadius: 5, fontWeight: 500,
                color: TEXT_DARK, fontSize: "0.88rem",
                transition: "all 0.2s",
                "&:hover": { bgcolor: GOLD_LIGHT, color: GOLD_DARK, transform: "translateX(4px)" },
              }}
            >
              {item.text}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
}
