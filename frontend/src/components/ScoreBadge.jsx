import { Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

export default function ScoreBadge({ score, label = 'Score' }) {
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 1.5,
      px: 3.5, py: 1.5, borderRadius: '50px',
      background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(34,211,238,0.2))',
      border: '1px solid rgba(168,85,247,0.4)',
      boxShadow: '0 0 24px rgba(168,85,247,0.2)',
      backdropFilter: 'blur(10px)',
    }}>
      <EmojiEventsIcon sx={{ color: '#FBBF24', fontSize: 28 }} />
      <Box>
        <Typography variant="caption" display="block" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={800}
          sx={{
            background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >
          {score}
        </Typography>
      </Box>
      <StarIcon sx={{ color: '#FBBF24', fontSize: 20, opacity: 0.8 }} />
    </Box>
  );
}
