import { useRef, useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, LinearProgress,
  ToggleButtonGroup, ToggleButton, Chip, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BrushIcon from '@mui/icons-material/Brush';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { useDrawGame } from './useDrawGame';
import DrawCanvas from './DrawCanvas';
import { scoresApi } from '../../api/api';
import { sounds } from '../../utils/sounds';
import { fireConfetti } from '../../utils/confetti';

const DIFF_GRADIENT = {
  EASY:   'linear-gradient(135deg, #34D399, #0891B2)',
  MEDIUM: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
  HARD:   'linear-gradient(135deg, #F87171, #DB2777)',
};

export default function DrawGame({ currentProfile }) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  const {
    phase, difficulty, setDifficulty,
    round, currentPrompt, timeLeft, timeLimit,
    roundScores, score,
    startGame, timeUp, judge, reset, totalRounds,
  } = useDrawGame();

  useEffect(() => {
    if (!currentProfile) return;
    scoresApi.getByProfile(currentProfile.id).then(res => {
      const best = res.data.filter(s => s.game === 'draw').map(s => s.points);
      if (best.length) setBestScore(Math.max(...best));
    }).catch(() => {});
  }, [currentProfile]);

  // Save score on finish
  useEffect(() => {
    if (phase === 'finished' && currentProfile && !saved) {
      sounds.win();
      fireConfetti();
      scoresApi.save({ profileId: currentProfile.id, game: 'draw', points: score, difficulty })
        .then(() => { setSaved(true); if (!bestScore || score > bestScore) setBestScore(score); })
        .catch(() => {});
    }
  }, [phase]);

  // Timer warning sound
  useEffect(() => {
    if (phase === 'drawing' && timeLeft <= 5 && timeLeft > 0) sounds.tick?.();
  }, [timeLeft, phase]);

  // Clear canvas when new round starts
  useEffect(() => {
    if (phase === 'drawing') {
      setTimeout(() => canvasRef.current?.clear(), 50);
      setSaved(false);
    }
  }, [round, phase]);

  const handleJudge = (gotIt) => {
    if (gotIt) sounds.correct?.();
    else sounds.wrong?.();
    judge(gotIt);
  };

  const timerPct = (timeLeft / timeLimit) * 100;
  const timerColor = timerPct > 50 ? '#34D399' : timerPct > 25 ? '#FBBF24' : '#F87171';

  // ── IDLE (start screen) ────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/games')}
          sx={{ mb: 4, color: '#94A3B8' }}>Back</Button>
        <Box textAlign="center" mb={5}>
          <Typography variant="h2" mb={1}>🎨</Typography>
          <Typography variant="h3" fontWeight={800} mb={1}>Draw It!</Typography>
          <Typography color="text.secondary">
            Draw the given word before time runs out.<br />
            {totalRounds} rounds · Self-judge your drawing!
          </Typography>
          {bestScore !== null && (
            <Chip label={`Personal Best: ${bestScore} pts`} sx={{ mt: 2, fontWeight: 700, background: 'rgba(168,85,247,0.15)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.3)' }} />
          )}
        </Box>

        <Box sx={{ mb: 4, p: 3, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography fontWeight={700} mb={2} textAlign="center">Choose Difficulty</Typography>
          <ToggleButtonGroup value={difficulty} exclusive onChange={(_, v) => v && setDifficulty(v)} fullWidth>
            {['EASY', 'MEDIUM', 'HARD'].map(d => (
              <ToggleButton key={d} value={d} sx={{
                fontWeight: 700, color: '#94A3B8',
                '&.Mui-selected': { background: DIFF_GRADIENT[d], color: '#fff', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset' },
              }}>
                {d === 'EASY' ? '60s' : d === 'MEDIUM' ? '45s' : '30s'} · {d}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.secondary" mt={1} display="block" textAlign="center">
            {difficulty === 'EASY' ? '100 pts/round' : difficulty === 'MEDIUM' ? '150 pts/round' : '200 pts/round'} + time bonus
          </Typography>
        </Box>

        <Button fullWidth variant="contained" size="large" startIcon={<BrushIcon />}
          onClick={() => startGame(difficulty)}
          sx={{ py: 1.8, fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #A855F7, #6366F1)', '&:hover': { background: 'linear-gradient(135deg, #9333EA, #4F46E5)' } }}>
          Start Drawing!
        </Button>
      </Container>
    );
  }

  // ── DRAWING phase ──────────────────────────────────────────────────────
  if (phase === 'drawing') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => { reset(); navigate('/games'); }}
            sx={{ color: '#94A3B8' }}>Quit</Button>
          <Box display="flex" gap={1.5} alignItems="center">
            {Array.from({ length: totalRounds }).map((_, i) => (
              <Box key={i} sx={{
                width: 10, height: 10, borderRadius: '50%',
                background: i < round ? '#34D399' : i === round ? '#A855F7' : 'rgba(255,255,255,0.15)',
                boxShadow: i === round ? '0 0 8px #A855F7' : 'none',
              }} />
            ))}
          </Box>
          <Chip label={`Score: ${score}`} sx={{ fontWeight: 700, background: 'rgba(168,85,247,0.15)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.3)' }} />
        </Box>

        {/* Prompt */}
        <Box textAlign="center" mb={3}>
          <Typography variant="overline" color="text.secondary">Round {round + 1} of {totalRounds} · Draw...</Typography>
          <Typography variant="h3" fontWeight={900} sx={{
            background: DIFF_GRADIENT[difficulty],
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {currentPrompt}
          </Typography>
        </Box>

        {/* Timer */}
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color="text.secondary">Time remaining</Typography>
            <Typography variant="caption" fontWeight={700} sx={{ color: timerColor }}>{timeLeft}s</Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={timerPct}
            sx={{
              height: 8, borderRadius: 4,
              background: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': { background: timerColor, borderRadius: 4, transition: 'width 1s linear' },
            }}
          />
        </Box>

        {/* Canvas */}
        <DrawCanvas ref={canvasRef} disabled={false} />

        {/* Done early */}
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={timeUp} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#94A3B8' }}>
            Done drawing →
          </Button>
        </Box>
      </Container>
    );
  }

  // ── JUDGING phase ──────────────────────────────────────────────────────
  if (phase === 'judging') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="overline" color="text.secondary">Round {round + 1} · Time's up!</Typography>
          <Typography variant="h4" fontWeight={800} mb={1}>
            Did you draw <Box component="span" sx={{ background: DIFF_GRADIENT[difficulty], WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{currentPrompt}</Box>?
          </Typography>
          <Typography color="text.secondary">Be honest! Only you can see your drawing.</Typography>
        </Box>

        {/* Frozen canvas (disabled) */}
        <DrawCanvas ref={canvasRef} disabled={true} />

        <Box display="flex" gap={2} justifyContent="center" mt={4}>
          <Button
            variant="contained" size="large" startIcon={<CheckCircleIcon />}
            onClick={() => handleJudge(true)}
            sx={{
              px: 4, py: 1.5, fontWeight: 800, fontSize: '1rem',
              background: 'linear-gradient(135deg, #34D399, #0891B2)',
              '&:hover': { background: 'linear-gradient(135deg, #10B981, #0E7490)' },
            }}
          >
            Got it! ✓
          </Button>
          <Button
            variant="outlined" size="large" startIcon={<CancelIcon />}
            onClick={() => handleJudge(false)}
            sx={{
              px: 4, py: 1.5, fontWeight: 800, fontSize: '1rem',
              borderColor: '#F87171', color: '#F87171',
              '&:hover': { background: 'rgba(248,113,113,0.1)', borderColor: '#EF4444' },
            }}
          >
            Missed it ✗
          </Button>
        </Box>
      </Container>
    );
  }

  // ── FINISHED ───────────────────────────────────────────────────────────
  if (phase === 'finished') {
    const gotCount = roundScores.filter(r => r.gotIt).length;
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" mb={1}>
            {gotCount === totalRounds ? '🏆' : gotCount >= 3 ? '🎉' : '🎨'}
          </Typography>
          <Typography variant="h3" fontWeight={900} mb={1}>
            {gotCount === totalRounds ? 'Perfect!' : gotCount >= 3 ? 'Great Job!' : 'Nice Try!'}
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={3}>
            You drew {gotCount} / {totalRounds} correctly
          </Typography>
          <Box sx={{
            display: 'inline-block', px: 4, py: 2, borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))',
            border: '1px solid rgba(168,85,247,0.3)',
          }}>
            <Typography variant="h4" fontWeight={900} sx={{
              background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {score} pts
            </Typography>
          </Box>
        </Box>

        {/* Round breakdown */}
        <Box display="flex" flexDirection="column" gap={1.5} mb={4}>
          {roundScores.map((r, i) => (
            <Box key={i} sx={{
              display: 'flex', alignItems: 'center', gap: 2,
              p: 2, borderRadius: '12px',
              background: r.gotIt ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
              border: `1px solid ${r.gotIt ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
            }}>
              <Typography fontSize={20}>{r.gotIt ? '✅' : '❌'}</Typography>
              <Typography fontWeight={700} flex={1} sx={{ textTransform: 'capitalize' }}>{r.prompt}</Typography>
              <Typography variant="caption" color="text.secondary">{r.timeLeft}s left</Typography>
              <Chip
                label={r.pts > 0 ? `+${r.pts}` : '0'}
                size="small"
                sx={{
                  fontWeight: 700,
                  background: r.gotIt ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
                  color: r.gotIt ? '#34D399' : '#F87171',
                  border: `1px solid ${r.gotIt ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                }}
              />
            </Box>
          ))}
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 3, background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }}>
            Score saved! {bestScore === score ? '🏆 New personal best!' : ''}
          </Alert>
        )}

        <Box display="flex" gap={2}>
          <Button fullWidth variant="contained" onClick={() => { setSaved(false); startGame(difficulty); }}
            sx={{ py: 1.5, fontWeight: 800, background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
            Play Again
          </Button>
          <Button fullWidth variant="outlined" onClick={() => { reset(); navigate('/games'); }}
            sx={{ py: 1.5, fontWeight: 700, borderColor: 'rgba(255,255,255,0.2)', color: '#94A3B8' }}>
            Game Hub
          </Button>
        </Box>
      </Container>
    );
  }

  return null;
}
