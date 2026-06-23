import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GOLD, GOLD_BG, GOLD_DARK, TEXT_DARK, TEXT_MID } from '../../../theme/tokens';

export default function StatCard({ title, count, icon, loading, buttonText, onButtonClick, trend }) {
  return (
    <Card elevation={0} sx={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      borderRadius: 4,
      border: '1px solid rgba(184,151,42,0.12)',
      background: '#fff',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 40px rgba(184,151,42,0.13)`, borderColor: `${GOLD}40` },
      '&::after': {
        content: '""', position: 'absolute',
        bottom: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_DARK})`,
        opacity: 0, transition: 'opacity 0.3s',
      },
      '&:hover::after': { opacity: 1 },
    }}>
      <CardContent sx={{ flexGrow: 1, p: { xs: 3, md: 3.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ color: TEXT_MID, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', mb: 1.5 }}>
              {title}
            </Typography>
            {loading
              ? <Skeleton variant="rounded" width={90} height={46} sx={{ borderRadius: 2 }} />
              : <Typography sx={{ fontWeight: 800, color: TEXT_DARK, fontSize: { xs: '2rem', sm: '2.6rem' }, lineHeight: 1 }}>
                {count.toLocaleString()}
              </Typography>
            }
            {trend && !loading && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1.5, bgcolor: GOLD_BG, border: `1px solid ${GOLD}25`, borderRadius: 50, px: 1.2, py: 0.3 }}>
                <TrendingUpIcon sx={{ fontSize: 13, color: GOLD }} />
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: GOLD_DARK }}>{trend}</Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: GOLD_BG, color: GOLD_DARK, border: `2px solid ${GOLD}25`, width: { xs: 54, sm: 64 }, height: { xs: 54, sm: 64 }, boxShadow: `0 6px 20px ${GOLD}18`, flexShrink: 0 }}>
            {React.cloneElement(icon, { sx: { fontSize: { xs: '1.5rem', sm: '1.9rem' } } })}
          </Avatar>
        </Box>
      </CardContent>
      <Box sx={{ px: { xs: 3, md: 3.5 }, pb: { xs: 3, md: 3.5 } }}>
        <Button fullWidth onClick={onButtonClick} disabled={loading} endIcon={<ArrowForwardIcon sx={{ fontSize: '0.9rem !important' }} />}
          sx={{
            py: 1.2, borderRadius: 10, fontWeight: 700, fontSize: '0.84rem', textTransform: 'none',
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`, color: 'white',
            boxShadow: `0 4px 14px ${GOLD}30`,
            '&:hover:not(:disabled)': { background: GOLD_DARK, boxShadow: `0 6px 20px ${GOLD}45` },
            '&:disabled': { opacity: 0.5 },
          }}>
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
}