import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { scoresApi } from '../api/api';

const GAMES = [
  {
    key: 'memory',
    title: 'Memory Match',
    description: 'Flip cards, find matching pairs, and challenge your memory skills.',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
    tag: 'Focus',
    path: '/games/memory',
  },
  {
    key: 'math',
    title: 'Math Challenge',
    description: 'Race against the clock solving arithmetic puzzles under pressure.',
    emoji: '🔢',
    gradient: 'linear-gradient(135deg, #DB2777, #F59E0B)',
    tag: 'Speed',
    path: '/games/math',
  },
  {
    key: 'word',
    title: 'Word Spelling',
    description: 'Unscramble jumbled letters and spell the hidden word correctly.',
    emoji: '📝',
    gradient: 'linear-gradient(135deg, #0891B2, #34D399)',
    tag: 'Vocabulary',
    path: '/games/word',
  },
  {
    key: 'puzzle',
    title: 'Sliding Puzzle',
    description: 'Slide the emoji tiles into the correct order to solve the puzzle.',
    emoji: '🧩',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    tag: 'Logic',
    path: '/games/puzzle',
  },
];

export default function GameHub({ currentProfile }) {
  const navigate = useNavigate();
  const [bestScores, setBestScores] = useState({});

  useEffect(() => {
    if (!currentProfile) return;
    scoresApi.getByProfile(currentProfile.id).then(res => {
      const bests = {};
      res.data.forEach(s => {
        if (!bests[s.game] || s.points > bests[s.game]) bests[s.game] = s.points;
      });
      setBestScores(bests);
    }).catch(() => {});
  }, [currentProfile]);

  if (!currentProfile) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h2" mb={2}>👋</Typography>
        <Typography variant="h4" fontWeight={700} mb={1}>No player selected</Typography>
        <Typography color="text.secondary" mb={4}>Choose a profile to start playing games and tracking your progress.</Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/profiles')}>
          Choose Player
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero */}
      <Box mb={7}>
        <Typography variant="overline" sx={{ color: '#A855F7', fontWeight: 700, letterSpacing: '0.15em' }}>
          Game Hub
        </Typography>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="h3" fontWeight={800}>
            Welcome back,{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {currentProfile.name}
            </Box>
            {' '}{currentProfile.avatar}
          </Typography>
        </Box>
        <Typography color="text.secondary" mt={1}>
          Pick a game and start earning points on the leaderboard.
        </Typography>
      </Box>

      {/* Stats strip */}
      <Box
        display="flex" gap={2} flexWrap="wrap" mb={6}
        sx={{
          p: 2.5, borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {GAMES.map(g => (
          <Box key={g.key} flex={1} minWidth={120} textAlign="center">
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
              {g.emoji} {g.title}
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{
              background: g.gradient,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {bestScores[g.key] !== undefined ? bestScores[g.key] : '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">Best score</Typography>
          </Box>
        ))}
      </Box>

      {/* Game Cards */}
      <Grid container spacing={3}>
        {GAMES.map(game => (
          <Grid item xs={12} sm={6} md={4} key={game.key}>
            <GameCard
              {...game}
              onClick={() => navigate(game.path)}
              badge={bestScores[game.key] !== undefined ? bestScores[game.key] : null}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
