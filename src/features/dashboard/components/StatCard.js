import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Button,
  Skeleton,
  Fade
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function StatCard({ 
  title, 
  count, 
  icon, 
  color = '#1976d2', 
  loading, 
  buttonText, 
  onButtonClick,
  trend 
}) {
  return (
    <Fade in timeout={500}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          },
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ 
          flexGrow: 1, 
          p: { xs: 2.5, md: 3 } // Responsive padding
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontWeight: 500, mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                {title}
              </Typography>
              {loading ? (
                // Responsive Skeleton
                <Skeleton 
                  variant="rectangular" 
                  sx={{ width: { xs: 80, sm: 100 }, height: { xs: 34, sm: 48 } }} 
                />
              ) : (
                <Typography 
                  // Responsive variant (h4 on mobile, h3 on desktop)
                  variant={{ xs: 'h4', sm: 'h3' }} 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 0.5
                  }}
                >
                  {count.toLocaleString()}
                </Typography>
              )}
              {trend && !loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    {trend}
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar 
              sx={{ 
                bgcolor: color, 
                // Responsive Avatar size
                width: { xs: 56, sm: 64 }, 
                height: { xs: 56, sm: 64 },
                boxShadow: `0 4px 14px ${color}40`
              }}
            >
              {/* Responsive Icon size */}
              {React.cloneElement(icon, { sx: { fontSize: { xs: '1.75rem', sm: '2rem' }, color: 'white' } })}
            </Avatar>
          </Box>
        </CardContent>
        
        <Box sx={{ p: 2, pt: 0 }}>
          <Button 
            fullWidth
            variant="contained" 
            onClick={onButtonClick}
            disabled={loading}
            sx={{ 
              backgroundColor: color,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.2,
              borderRadius: 1.5,
              '&:hover': { 
                backgroundColor: color,
                opacity: 0.9,
                transform: 'scale(1.02)'
              },
              transition: 'all 0.2s'
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