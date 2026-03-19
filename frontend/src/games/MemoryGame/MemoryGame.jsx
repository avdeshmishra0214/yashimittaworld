import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, Paper,
  ToggleButtonGroup, ToggleButton, Alert, Chip
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useMemoryGame } from './useMemoryGame';
import { scoresApi } from '../../api/api';
import ScoreBadge from '../../components/ScoreBadge';
import { sounds } from '../../utils/sounds';
import { fireConfetti } from '../../utils/confetti';

export default function MemoryGame({ currentProfile }) {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');
  const { cards, flipped, matched, moves, seconds, finished, flipCard, initGame, score } = useMemoryGame(difficulty);
  const [saved, setSaved] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  useEffect(() => {
    if (!currentProfile) return;
    scoresApi.getByProfile(currentProfile.id).then(res => {
      const memScores = res.data.filter(s => s.game === 'memory').map(s => s.points);
      if (memScores.length > 0) setBestScore(Math.max(...memScores));
    }).catch(() => {});
  }, [currentProfile]);

  useEffect(() => {
    if (matched.length > 0 && matched.length < cards.length) sounds.match();
  }, [matched.length]);

  useEffect(() => {
    if (finished && currentProfile && !saved) {
      sounds.win();
      fireConfetti();
      scoresApi.save({ profileId: currentProfile.id, game: 'memory', points: score, difficulty: difficulty.toUpperCase() })
        .then(() => { setSaved(true); if (!bestScore || score > bestScore) setBestScore(score); })
        .catch(() => {});
    }
  }, [finished, currentProfile, saved, score, difficulty, bestScore]);

  const handleFlip = (id) => { if (!finished) { sounds.flip(); flipCard(id); } };
  const handleRestart = () => { setSaved(false); initGame(); };

  const cols = difficulty === 'hard' ? 6 : 4;
  const cardSize = difficulty === 'hard' ? 72 : 92;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/games')}
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
          Back
        </Button>
        <Box flex={1}>
          <Typography variant="overline" sx={{ color: '#7C3AED', fontWeight: 700, letterSpacing: '0.12em' }}>
            Memory Match
          </Typography>
          <Typography variant="h4" fontWeight={800}>Find the pairs 🧠</Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
        p: 2, borderRadius: '14px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        mb: 3,
      }}>
        <ToggleButtonGroup value={difficulty} exclusive size="small"
          onChange={(_, v) => { if (v) { setDifficulty(v); setSaved(false); } }}>
          <ToggleButton value="easy">Easy 4×4</ToggleButton>
          <ToggleButton value="hard">Hard 6×6</ToggleButton>
        </ToggleButtonGroup>
        <Chip label={`Moves: ${moves}`} sx={{ background: 'rgba(129,140,248,0.15)', color: '#818CF8', border: '1px solid rgba(129,140,248,0.3)', fontWeight: 700 }} />
        <Chip label={`${seconds}s`} sx={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)', fontWeight: 700 }} />
        {bestScore !== null && <Chip label={`Best: ${bestScore}`} sx={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', fontWeight: 700 }} />}
        <Box flex={1} />
        <Button startIcon={<RestartAltIcon />} variant="outlined" size="small" onClick={handleRestart}
          sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'text.secondary' }}>
          Restart
        </Button>
      </Box>

      {!currentProfile && <Alert severity="warning" sx={{ mb: 2 }}>Select a profile to save your score!</Alert>}

      {finished && (
        <Box sx={{
          mb: 3, p: 3, borderRadius: '16px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(168,85,247,0.1))',
          border: '1px solid rgba(52,211,153,0.3)',
        }}>
          <Typography variant="h4" fontWeight={800} mb={1}>🎉 You won!</Typography>
          <Typography color="text.secondary" mb={2}>
            {moves} moves · {seconds} seconds
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <ScoreBadge score={score} />
            <Button variant="contained" onClick={handleRestart}>Play Again</Button>
          </Box>
        </Box>
      )}

      {/* Card grid */}
      <Box
        display="grid"
        sx={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 1.5 }}
        maxWidth={cols * (cardSize + 12)} mx="auto"
      >
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <Box
              key={card.id}
              onClick={() => handleFlip(card.id)}
              sx={{
                width: cardSize, height: cardSize,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: cardSize * 0.42,
                borderRadius: '14px', cursor: finished ? 'default' : 'pointer',
                userSelect: 'none', transition: 'all 0.22s ease',
                transform: isFlipped ? 'scale(1.04)' : 'scale(1)',
                background: isMatched
                  ? 'linear-gradient(135deg, rgba(52,211,153,0.3), rgba(34,211,238,0.3))'
                  : isFlipped
                  ? 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(248,113,113,0.25))'
                  : 'rgba(255,255,255,0.05)',
                border: isMatched
                  ? '1px solid rgba(52,211,153,0.5)'
                  : isFlipped
                  ? '1px solid rgba(251,191,36,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isMatched ? '0 0 16px rgba(52,211,153,0.3)'
                  : isFlipped ? '0 0 12px rgba(251,191,36,0.2)' : 'none',
                '&:hover': !isFlipped && !finished ? {
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.4)',
                  transform: 'scale(1.06)',
                } : {},
              }}
            >
              {isFlipped ? card.emoji : ''}
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
