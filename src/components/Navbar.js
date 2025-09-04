import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Link from '@mui/material/Link';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Logo / Title - Correctly styled */}
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 , fontWeight: 'bold'}}>
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

          {/* Dropdown Menu - Corrected for client-side routing */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            // Better positioning
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {/* Each MenuItem now uses RouterLink and closes the menu on click */}
            <MenuItem sx={{fontWeight: 'bold'}} component={Link} href="/login" onClick={handleMenuClose}>Login</MenuItem>
            <MenuItem sx={{fontWeight: 'bold'}} component={Link} href="/doctor-register" onClick={handleMenuClose}>Register as Doctor</MenuItem>
            <MenuItem sx={{fontWeight: 'bold'}} component={Link} href="/patient-register" onClick={handleMenuClose}>Register as Patient</MenuItem>
            <MenuItem sx={{fontWeight: 'bold'}} component={Link} href="/receptionist-register" onClick={handleMenuClose}>Register as Receptionist</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}