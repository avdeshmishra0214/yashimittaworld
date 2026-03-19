import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Tabs, Tab, Avatar,
  CircularProgress, Chip
} from '@mui/material';
import { scoresApi, profilesApi } from '../api/api';

const GAMES = [
  { key: 'memory', label: 'Memory Match',   emoji: '🧠', gradient: 'linear-gradient(135deg, #7C3AED, #4F46E5)' },
  { key: 'math',   label: 'Math Challenge', emoji: '🔢', gradient: 'linear-gradient(135deg, #DB2777, #F59E0B)' },
  { key: 'word',   label: 'Word Spelling',  emoji: '📝', gradient: 'linear-gradient(135deg, #0891B2, #34D399)' },
  { key: 'puzzle', label: 'Sliding Puzzle', emoji: '🧩', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
];

const MEDALS = ['🥇', '🥈', '🥉'];
const RANK_COLORS = ['#FBBF24', '#94A3B8', '#CD7F32'];

export default function Leaderboard() {
  const [tab, setTab] = useState(0);
  const [scores, setScores] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profilesApi.getAll().then(res => {
      const map = {};
      res.data.forEach(p => { map[p.id] = p; });
      setProfiles(map);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    scoresApi.getLeaderboard(GAMES[tab].key)
      .then(res => setScores(res.data))
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [tab]);

  const game = GAMES[tab];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Header */}
      <Box textAlign="center" mb={5}>
        <Typography variant="overline" sx={{ color: '#A855F7', fontWeight: 700, letterSpacing: '0.15em' }}>
          Hall of Fame
        </Typography>
        <Typography variant="h3" fontWeight={800}>
          🏆 Leaderboard
        </Typography>
        <Typography color="text.secondary" mt={1}>Top 10 players for each game</Typography>
      </Box>

      {/* Game tabs */}
      <Box sx={{
        mb: 5, p: 0.5, borderRadius: '14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{
            '& .MuiTab-root': {
              borderRadius: '10px', fontWeight: 600, color: '#94A3B8',
              transition: 'all 0.2s',
              '&.Mui-selected': {
                color: '#fff',
                background: game.gradient,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              },
            },
          }}
        >
          {GAMES.map(g => (
            <Tab key={g.key} label={`${g.emoji} ${g.label}`} />
          ))}
        </Tabs>
      </Box>

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress sx={{ color: '#A855F7' }} />
        </Box>
      ) : scores.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h2" mb={2}>🎮</Typography>
          <Typography variant="h5" fontWeight={700} mb={1}>No scores yet</Typography>
          <Typography color="text.secondary">Be the first to play and claim the top spot!</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {scores.map((s, i) => {
            const profile = profiles[s.profileId];
            const isTop3 = i < 3;
            return (
              <Box
                key={s.id}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  p: 2.5, borderRadius: '16px',
                  background: isTop3
                    ? `linear-gradient(135deg, ${i === 0 ? 'rgba(251,191,36,0.08)' : i === 1 ? 'rgba(148,163,184,0.08)' : 'rgba(205,127,50,0.08)'}, rgba(255,255,255,0.02))`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isTop3
                    ? (i === 0 ? 'rgba(251,191,36,0.3)' : i === 1 ? 'rgba(148,163,184,0.2)' : 'rgba(205,127,50,0.2)')
                    : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateX(4px)', borderColor: 'rgba(168,85,247,0.3)' },
                }}
              >
                {/* Rank */}
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                  background: isTop3
                    ? `radial-gradient(circle, ${RANK_COLORS[i]}33, transparent)`
                    : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isTop3 ? 22 : 14, fontWeight: 800,
                  color: isTop3 ? RANK_COLORS[i] : '#64748B',
                  border: isTop3 ? `1px solid ${RANK_COLORS[i]}44` : '1px solid rgba(255,255,255,0.08)',
                }}>
                  {isTop3 ? MEDALS[i] : `#${i + 1}`}
                </Box>

                {/* Avatar + name */}
                <Box display="flex" alignItems="center" gap={1.5} flex={1}>
                  <Box sx={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: game.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {profile?.avatar || '👤'}
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>
                      {profile ? profile.name : `Player #${s.profileId}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(s.playedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Difficulty */}
                <Chip
                  label={s.difficulty}
                  size="small"
                  sx={{
                    fontWeight: 700, fontSize: '0.7rem',
                    background: s.difficulty === 'HARD'
                      ? 'rgba(248,113,113,0.15)' : s.difficulty === 'MEDIUM'
                      ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)',
                    color: s.difficulty === 'HARD' ? '#F87171'
                      : s.difficulty === 'MEDIUM' ? '#FBBF24' : '#34D399',
                    border: `1px solid ${s.difficulty === 'HARD' ? 'rgba(248,113,113,0.3)'
                      : s.difficulty === 'MEDIUM' ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.3)'}`,
                  }}
                />

                {/* Score */}
                <Box textAlign="right" minWidth={80}>
                  <Typography variant="h6" fontWeight={800} sx={{
                    background: game.gradient,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    {s.points}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">pts</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
}
