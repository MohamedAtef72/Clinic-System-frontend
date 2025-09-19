import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "@mui/material/Link";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

export default function Navbar() {
  const token = sessionStorage.getItem("token");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        const roles =
          decoded["role"] ||
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];


        setRole(Array.isArray(roles) ? roles[0] : roles);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    Cookies.remove("refreshToken");
    setRole(null);
  };

  let navItems = [];

  if (token) {
    navItems = [
      { text: "Profile", path: "/profile" },
      ...(role === "Admin" ? [{ text: "Dashboard", path: "/admin" } , {text: "AddDoctor" , path:"/doctor-register"},{text: "AddReceptionist" , path:"/receptionist-register"}] : []),
      ...(role === "Receptionist" ? [{text: "AddPatient" , path:"/patient-register"}] : []),

      { text: "Logout", path: "/login", isLogout: true },
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
          {/* Logo / Title */}
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            <Link href="/" underline="none" color="white">
              MedClinic Pro
            </Link>
          </Typography>

          {/* Menu Button */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {navItems.map((item) =>
              item.isLogout ? (
                <MenuItem
                  key={item.text}
                  component={Link}
                  href={item.path}
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
                  {item.text}
                </MenuItem>
              ) : (
                <MenuItem
                  key={item.text}
                  onClick={handleMenuClose}
                  component={Link}
                  href={item.path}
                >
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
