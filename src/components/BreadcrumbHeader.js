import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_MID } from "../theme/tokens";
/**
 * Reusable Breadcrumb Header Bar component.
 *
 * @param {string} currentPage - The label for the current (active) breadcrumb item.
 * @param {React.ReactNode} [children] - Optional extra content rendered to the right (e.g. filter buttons).
 */
export default function BreadcrumbHeader({ currentPage, children }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: GOLD_BG,
        borderRadius: 3,
        border: `1px solid rgba(184,151,42,0.15)`,
        py: 2,
        px: { xs: 2, sm: 4, md: 5 },
        mb: 4,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: TEXT_MID }} />}>
          <Link
            underline="hover"
            color="inherit"
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: TEXT_MID,
              fontSize: "0.95rem",
              fontWeight: 600,
              "&:hover": { color: GOLD },
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Home
          </Link>
          <Typography sx={{ color: GOLD_DARK, fontWeight: 800, fontSize: "0.95rem" }}>
            {currentPage}
          </Typography>
        </Breadcrumbs>
      </Box>
      {children}
    </Box>
  );
}
