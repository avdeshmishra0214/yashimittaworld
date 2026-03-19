import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, Chip,
  ToggleButtonGroup, ToggleButton, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useNavigate } from 'react-router-dom';
import { usePuzzleGame } from './usePuzzleGame';
import { scoresApi } from '../../api/api';
import ScoreBadge from '../../components/ScoreBadge';
import { sounds } from '../../utils/sounds';
import { fireConfetti } from '../../utils/confetti';

const GRADIENT = 'linear-gradient(135deg, #F59E0B, #EF4444)';

export default function PuzzleGame({ currentProfile }) {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');
  const { tiles, size, moves, seconds, solved, moveTile, initGame, score } = usePuzzleGame(difficulty);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (solved && currentProfile && !saved) {
      sounds.win();
      fireConfetti();
      scoresApi.save({
        profileId: currentProfile.id,
        game: 'puzzle',
        points: score,
        difficulty: difficulty.toUpperCase(),
      }).then(() => setSaved(true)).catch(() => {});
    }
  }, [solved, currentProfile, saved, score, difficulty]);

  const handleRestart = () => { setSaved(false); initGame(); };

  const tileSize = size === 4 ? 80 : 110;
  const gap = 6;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/games')}
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
          Back
        </Button>
        <Box>
          <Typography variant="overline" sx={{ color: '#F59E0B', fontWeight: 700, letterSpacing: '0.12em' }}>
            Sliding Puzzle
          </Typography>
          <Typography variant="h4" fontWeight={800}>Slide to solve 🧩</Typography>
        </Box>
      </Box>

      {/* Controls bar */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
        p: 2, borderRadius: '14px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        mb: 3,
      }}>
        <ToggleButtonGroup value={difficulty} exclusive size="small"
          onChange={(_, v) => { if (v) { setDifficulty(v); setSaved(false); } }}>
          <ToggleButton value="easy">Easy 3×3</ToggleButton>
          <ToggleButton value="hard">Hard 4×4</ToggleButton>
        </ToggleButtonGroup>
        <Chip label={`Moves: ${moves}`}
          sx={{ background: 'rgba(245,158,11,0.15)', color: '#FBBF24', border: '1px solid rgba(245,158,11,0.3)', fontWeight: 700 }} />
        <Chip label={`${seconds}s`}
          sx={{ background: 'rgba(129,140,248,0.15)', color: '#818CF8', border: '1px solid rgba(129,140,248,0.3)', fontWeight: 700 }} />
        <Box flex={1} />
        <Button startIcon={<RestartAltIcon />} variant="outlined" size="small" onClick={handleRestart}
          sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'text.secondary' }}>
          Restart
        </Button>
      </Box>

      {!currentProfile && <Alert severity="warning" sx={{ mb: 2 }}>Select a profile to save your score!</Alert>}

      {/* Win banner */}
      {solved && (
        <Box sx={{
          mb: 3, p: 3, borderRadius: '16px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.1))',
          border: '1px solid rgba(245,158,11,0.35)',
        }}>
          <Typography variant="h4" fontWeight={800} mb={1}>🎉 Puzzle Solved!</Typography>
          <Typography color="text.secondary" mb={2}>
            {moves} moves · {seconds} seconds
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <ScoreBadge score={score} />
            <Button variant="contained" onClick={handleRestart}>Play Again</Button>
          </Box>
        </Box>
      )}

      {/* Puzzle hint */}
      {!solved && (
        <Box sx={{
          mb: 2, px: 2, py: 1, borderRadius: '10px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap',
        }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>Goal order: </Typography>
          {(difficulty === 'easy'
            ? ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼']
            : ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐙']
          ).map((e, i) => (
            <Typography key={i} sx={{ fontSize: 16 }}>{e}</Typography>
          ))}
        </Box>
      )}

      {/* Puzzle grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${tileSize}px)`,
          gap: `${gap}px`,
          p: 2,
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          width: 'fit-content',
          mx: 'auto',
          boxShadow: solved ? '0 0 40px rgba(245,158,11,0.25)' : 'none',
          transition: 'box-shadow 0.5s',
        }}
      >
        {tiles.map((tile, idx) => {
          const isEmpty = tile === null;
          const neighbors = tiles.findIndex(t => t === null) !== -1
            ? (() => {
                const emptyIdx = tiles.findIndex(t => t === null);
                return getNeighbors(emptyIdx, size).includes(idx);
              })()
            : false;

          return (
            <Box
              key={isEmpty ? 'empty' : tile.id}
              onClick={() => !isEmpty && moveTile(idx)}
              sx={{
                width: tileSize, height: tileSize,
                borderRadius: size === 4 ? '12px' : '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: size === 4 ? tileSize * 0.42 : tileSize * 0.48,
                cursor: isEmpty ? 'default' : neighbors ? 'pointer' : 'default',
                userSelect: 'none',
                transition: 'all 0.15s ease',
                background: isEmpty
                  ? 'rgba(255,255,255,0.03)'
                  : solved
                  ? 'linear-gradient(135deg, rgba(52,211,153,0.25), rgba(34,211,238,0.25))'
                  : neighbors
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))'
                  : 'rgba(255,255,255,0.06)',
                border: isEmpty
                  ? '1.5px dashed rgba(255,255,255,0.08)'
                  : solved
                  ? '1.5px solid rgba(52,211,153,0.5)'
                  : neighbors
                  ? '1.5px solid rgba(245,158,11,0.5)'
                  : '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: isEmpty ? 'none'
                  : solved ? '0 0 12px rgba(52,211,153,0.3)'
                  : neighbors ? '0 0 10px rgba(245,158,11,0.2)' : 'none',
                transform: neighbors && !isEmpty && !solved ? 'scale(1.03)' : 'scale(1)',
                '&:hover': !isEmpty && neighbors && !solved ? {
                  transform: 'scale(1.08)',
                  boxShadow: '0 0 18px rgba(245,158,11,0.4)',
                } : {},
              }}
            >
              {!isEmpty && tile.emoji}
            </Box>
          );
        })}
      </Box>

      {/* Instructions */}
      {!solved && moves === 0 && (
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={2}>
          Click any highlighted tile to slide it into the empty space
        </Typography>
      )}
    </Container>
  );
}

function getNeighbors(idx, size) {
  const row = Math.floor(idx / size);
  const col = idx % size;
  const n = [];
  if (row > 0)        n.push(idx - size);
  if (row < size - 1) n.push(idx + size);
  if (col > 0)        n.push(idx - 1);
  if (col < size - 1) n.push(idx + 1);
  return n;
}
