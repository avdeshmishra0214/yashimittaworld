import { Box, Typography, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function GameCard({ title, description, emoji, gradient, onClick, badge, tag }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative', overflow: 'hidden',
        borderRadius: '24px', cursor: 'pointer', p: '1px',
        background: gradient,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        },
        '&:hover .arrow-icon': { transform: 'translateX(4px)' },
        '&:hover .emoji-box': { transform: 'scale(1.1) rotate(-5deg)' },
      }}
    >
      {/* Inner card */}
      <Box sx={{
        borderRadius: '23px',
        background: 'rgba(11, 11, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        p: 3.5,
        height: '100%',
      }}>
        {/* Top row */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
          <Box
            className="emoji-box"
            sx={{
              width: 64, height: 64, borderRadius: '16px',
              background: gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, transition: 'transform 0.3s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}
          >
            {emoji}
          </Box>
          {tag && (
            <Chip label={tag} size="small" sx={{
              background: 'rgba(255,255,255,0.08)',
              color: '#94A3B8', fontSize: '0.7rem', fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.1)',
            }} />
          )}
        </Box>

        {/* Content */}
        <Typography variant="h5" fontWeight={700} mb={0.75} color="text.primary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2.5} sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>

        {/* Footer */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {badge !== null && badge !== undefined ? (
            <Chip
              label={`Best: ${badge} pts`}
              size="small"
              sx={{
                background: 'rgba(168,85,247,0.15)',
                color: '#C084FC', fontWeight: 700,
                border: '1px solid rgba(168,85,247,0.3)',
              }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">No scores yet</Typography>
          )}
          <Box
            className="arrow-icon"
            sx={{
              width: 32, height: 32, borderRadius: '50%',
              background: gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.3s ease',
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: 16, color: '#fff' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
