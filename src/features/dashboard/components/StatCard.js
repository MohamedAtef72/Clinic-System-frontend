import React from 'react';
import {
  Card, CardContent, Typography, Box, Avatar, Button, Skeleton, Fade
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from "../../../theme/tokens";
function StatCard({
  title, count, icon, loading, buttonText, onButtonClick, trend
}) {
  return (
    <Fade in timeout={500}>
      <Card
        elevation={0}
        sx={{
          width: "270px",
          height: '100%',
          display: 'flex', flexDirection: 'column',
          borderRadius: 4,
          border: '1px solid rgba(184,151,42,0.15)',
          background: "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)",
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: `0 16px 40px rgba(184,151,42,0.12)`,
            borderColor: `${GOLD}40`
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: { xs: 3, md: 3.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography
                sx={{
                  color: TEXT_MID, fontSize: "0.75rem", fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: "1px", mb: 1.5
                }}
              >
                {title}
              </Typography>
              {loading ? (
                <Skeleton variant="rounded" sx={{ width: { xs: 80, sm: 100 }, height: { xs: 34, sm: 48 }, borderRadius: 2 }} />
              ) : (
                <Typography
                  sx={{
                    fontWeight: 800, color: TEXT_DARK,
                    fontSize: { xs: '2rem', sm: '2.5rem' }, lineHeight: 1
                  }}
                >
                  {count.toLocaleString()}
                </Typography>
              )}
              {trend && !loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
                  <Box sx={{ bgcolor: GOLD_BG, color: "black", borderRadius: 50, px: 1, py: 0.2, display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 14 }} />
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700 }}>{trend}</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Gold Icon Box */}
            <Avatar
              sx={{
                bgcolor: GOLD_BG, color: GOLD_DARK,
                border: `1.5px solid ${GOLD}40`,
                width: { xs: 60, sm: 70 }, height: { xs: 60, sm: 70 },
                boxShadow: `0 8px 24px ${GOLD}20`
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: { xs: '1.8rem', sm: '2.2rem' } } })}
            </Avatar>
          </Box>
        </CardContent>

        <Box sx={{ p: { xs: 2.5, md: 3 }, pt: 0 }}>
          <Button
            fullWidth
            onClick={onButtonClick}
            disabled={loading}
            sx={{
              py: 1.4, borderRadius: 50, fontWeight: 700, fontSize: "0.9rem",
              textTransform: "none",
              background: GOLD,
              color: "white",
              boxShadow: `0 6px 20px ${GOLD}35`,
              "&:hover:not(:disabled)": {
                background: GOLD_DARK, boxShadow: `0 8px 25px ${GOLD}50`
              },
            }}
          >
            {buttonText}
          </Button>
        </Box>
      </Card>
    </Fade>
  );
}

export default StatCard;