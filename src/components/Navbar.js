// import React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MenuIcon from "@mui/icons-material/Menu";
// import Link from "@mui/material/Link";
// import  useAuth  from "../contexts/AuthContext.js";
// import { logout as Logout } from "../services/authService";
// import { useNavigate } from "react-router-dom";


// export default function Navbar() {
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const { user, isAuthenticated , refreshAuth} = useAuth();


//   const refresh = async () => {
//     try {
//       await refreshAuth();
//     } catch (error) {
//       console.error("Refresh failed:", error);
//     }
//   };

//   const handleMenuOpen = (event) => {
//     refresh();
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const logout = async () => {
//     try {
//       await Logout();
//       await refreshAuth();
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     } 
//   };

//   let navItems = [];

//   if (isAuthenticated === true) {
//     navItems = [
//       { text: "Profile", path: "/profile" },
//       { text: "Doctors", path: "/doctors" },
//       ...(user.role === "Admin"
//         ? [
//             { text: "Dashboard", path: "/admin" },
//             { text: "AddDoctor", path: "/doctor-register" },
//             { text: "AddReceptionist", path: "/receptionist-register" },
//           ]
//         : []),
//       ...(user.role === "Receptionist"
//         ? [{ text: "AddPatient", path: "/patient-register" }]
//         : []),
//       { text: "Logout", path: "/", isLogout: true },
//     ];
//   } else {
//     navItems = [
//       { text: "Login", path: "/login" },
//       { text: "Register as Patient", path: "/patient-register" },
//     ];
//   }

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography
//             variant="h5"
//             component="div"
//             sx={{ flexGrow: 1, fontWeight: "bold" }}
//           >
//             <Link href="/" underline="none" color="white">
//               MedClinic Pro
//             </Link>
//           </Typography>

//           <IconButton
//             size="large"
//             edge="end"
//             color="inherit"
//             aria-label="menu"
//             onClick={handleMenuOpen}
//           >
//             <MenuIcon />
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             {navItems.map((item) =>
//               item.isLogout ? (
//                 <MenuItem
//                   key={item.text}
//                   component={Link}
//                   onClick={() => {
//                     handleMenuClose();
//                     logout();
//                   }}
//                 >
//                   {item.text}
//                 </MenuItem>
//               ) : (
//                 <MenuItem
//                   key={item.text}
//                   onClick={handleMenuClose}
//                   component={Link}
//                   href={item.path}
//                 >
//                   {item.text}
//                 </MenuItem>
//               )
//             )}
//           </Menu>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }

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
            { text: "Dashboard", path: "/admin" },
            { text: "AddDoctor", path: "/doctor-register" },
            { text: "AddReceptionist", path: "/receptionist-register" },
          ]
        : []),
      ...(user?.role === "Receptionist"
        ? [{ text: "AddPatient", path: "/patient-register" }]
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
                <MenuItem key={item.text} component={Link} href={item.path} onClick={handleMenuClose}>
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
