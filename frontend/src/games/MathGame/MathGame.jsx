import { useState, useEffect, useRef } from 'react';
import {
  Container, Typography, Box, Button, Paper, TextField,
  LinearProgress, ToggleButtonGroup, ToggleButton, Alert, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useMathGame } from './useMathGame';
import { scoresApi } from '../../api/api';
import ScoreBadge from '../../components/ScoreBadge';
import { sounds } from '../../utils/sounds';
import { fireConfetti } from '../../utils/confetti';

export default function MathGame({ currentProfile }) {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('easy');
  const { questions, current, input, setInput, results, timeLeft, phase, feedback, initGame, submitAnswer, score, correct, totalQuestions } = useMathGame(difficulty);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef(null);
  const prevTime = useRef(timeLeft);

  useEffect(() => {
    if (phase === 'playing' && inputRef.current) inputRef.current.focus();
  }, [phase, current]);

  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 5 && timeLeft > 0 && timeLeft !== prevTime.current) sounds.tick();
    prevTime.current = timeLeft;
  }, [timeLeft, phase]);

  useEffect(() => {
    if (feedback === 'correct') sounds.correct();
    if (feedback === 'wrong') sounds.wrong();
  }, [feedback]);

  useEffect(() => {
    if (phase === 'finished' && currentProfile && !saved) {
      sounds.win(); fireConfetti();
      scoresApi.save({ profileId: currentProfile.id, game: 'math', points: score, difficulty: difficulty.toUpperCase() })
        .then(() => setSaved(true)).catch(() => {});
    }
  }, [phase, currentProfile, saved, score, difficulty]);

  const handleStart = () => { setSaved(false); initGame(); };
  const timerPct = (timeLeft / 15) * 100;
  const timerColor = timeLeft > 8 ? '#34D399' : timeLeft > 4 ? '#FBBF24' : '#F87171';

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/games')}
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
          Back
        </Button>
        <Box>
          <Typography variant="overline" sx={{ color: '#DB2777', fontWeight: 700, letterSpacing: '0.12em' }}>
            Math Challenge
          </Typography>
          <Typography variant="h4" fontWeight={800}>Beat the clock 🔢</Typography>
        </Box>
      </Box>

      {phase === 'idle' && (
        <Box sx={{
          textAlign: 'center', p: 5, borderRadius: '24px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Typography variant="h2" mb={2}>🔢</Typography>
          <Typography variant="h5" fontWeight={700} mb={1}>Ready to calculate?</Typography>
          <Typography color="text.secondary" mb={4}>10 questions · 15 seconds each · earn time bonuses!</Typography>
          <ToggleButtonGroup value={difficulty} exclusive onChange={(_, v) => v && setDifficulty(v)} sx={{ mb: 3 }}>
            <ToggleButton value="easy">Easy (1–9)</ToggleButton>
            <ToggleButton value="hard">Hard (10–99)</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <Button variant="contained" size="large" onClick={handleStart} sx={{ mt: 1, px: 5 }}>
            Start Game 🚀
          </Button>
        </Box>
      )}

      {phase === 'playing' && questions.length > 0 && (
        <Box>
          {/* Progress bar */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Question {current + 1} of {totalQuestions}
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: timerColor }}>
                ⏱ {timeLeft}s
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={timerPct}
              sx={{
                height: 8, borderRadius: 4,
                '& .MuiLinearProgress-bar': { background: timerColor, borderRadius: 4 },
              }} />
            <Box sx={{ height: 4, borderRadius: 4, mt: 0.5, background: 'rgba(255,255,255,0.06)' }}>
              <Box sx={{
                height: '100%', width: `${((current) / totalQuestions) * 100}%`,
                background: 'linear-gradient(90deg, #7C3AED, #DB2777)',
                borderRadius: 4, transition: 'width 0.3s',
              }} />
            </Box>
          </Box>

          {/* Question card */}
          <Box sx={{
            p: 5, textAlign: 'center', mb: 3, borderRadius: '20px',
            background: feedback === 'correct' ? 'rgba(52,211,153,0.08)'
              : feedback === 'wrong' ? 'rgba(248,113,113,0.08)'
              : 'rgba(255,255,255,0.04)',
            border: `1px solid ${feedback === 'correct' ? 'rgba(52,211,153,0.4)'
              : feedback === 'wrong' ? 'rgba(248,113,113,0.4)'
              : 'rgba(255,255,255,0.08)'}`,
            transition: 'all 0.3s',
          }}>
            <Typography variant="h2" fontWeight={900} fontFamily="monospace" letterSpacing={2}>
              {questions[current]?.text}
            </Typography>
            {feedback === 'correct' && <Typography variant="h5" mt={2} color="success.main">✅ Correct! +{results[results.length - 1]?.pts} pts</Typography>}
            {feedback === 'wrong' && <Typography variant="h5" mt={2} color="error.main">❌ Answer was {questions[current]?.answer}</Typography>}
          </Box>

          {!feedback && (
            <Box display="flex" gap={2}>
              <TextField inputRef={inputRef} fullWidth type="number" placeholder="Your answer"
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitAnswer(input)}
                inputProps={{ style: { fontSize: '1.8rem', textAlign: 'center', fontWeight: 800, fontFamily: 'monospace' } }}
              />
              <Button variant="contained" size="large" onClick={() => submitAnswer(input)} disabled={!input.trim()} sx={{ px: 3 }}>
                →
              </Button>
            </Box>
          )}

          <Box display="flex" justifyContent="center" mt={2}>
            <Chip label={`Score: ${score} pts`}
              sx={{ background: 'rgba(168,85,247,0.15)', color: '#C084FC', border: '1px solid rgba(168,85,247,0.3)', fontWeight: 700 }} />
          </Box>
        </Box>
      )}

      {phase === 'finished' && (
        <Box sx={{
          textAlign: 'center', p: 5, borderRadius: '24px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Typography variant="h2" mb={2}>🎯</Typography>
          <Typography variant="h4" fontWeight={800} mb={1}>Round Complete!</Typography>
          <Typography color="text.secondary" mb={3}>
            {correct} / {totalQuestions} correct answers
          </Typography>
          <Box display="flex" justifyContent="center" mb={4}><ScoreBadge score={score} label="Total Score" /></Box>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button variant="contained" size="large" onClick={handleStart}>Play Again</Button>
            <ToggleButtonGroup value={difficulty} exclusive onChange={(_, v) => v && setDifficulty(v)}>
              <ToggleButton value="easy">Easy</ToggleButton>
              <ToggleButton value="hard">Hard</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {!currentProfile && <Alert severity="warning" sx={{ mt: 3 }}>Select a profile to save your score!</Alert>}
        </Box>
      )}
    </Container>
  );
}
