import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, TextField,
  ToggleButtonGroup, ToggleButton, Alert, Chip, CircularProgress
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useWordGame } from './useWordGame';
import { wordsApi, scoresApi } from '../../api/api';
import ScoreBadge from '../../components/ScoreBadge';
import { sounds } from '../../utils/sounds';
import { fireConfetti, fireStar } from '../../utils/confetti';

export default function WordGame({ currentProfile }) {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('EASY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const { words, current, input, setInput, phase, showHint, setShowHint, feedback, startGame, submitAnswer, skipWord, score, correct } = useWordGame();

  useEffect(() => {
    if (feedback === 'correct') { sounds.correct(); fireStar(); }
    if (feedback === 'wrong') sounds.wrong();
  }, [feedback]);

  const handleStart = async () => {
    setSaved(false); setLoading(true); setError('');
    try {
      const res = await wordsApi.get(difficulty, 5);
      startGame(res.data);
    } catch { setError('Could not load words. Is the backend running?'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (phase === 'finished' && currentProfile && !saved) {
      sounds.win(); fireConfetti();
      scoresApi.save({ profileId: currentProfile.id, game: 'word', points: score, difficulty })
        .then(() => setSaved(true)).catch(() => {});
    }
  }, [phase, currentProfile, saved, score, difficulty]);

  const currentWord = words[current];
  const difficultyColor = difficulty === 'HARD' ? '#F87171' : difficulty === 'MEDIUM' ? '#FBBF24' : '#34D399';

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/games')}
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
          Back
        </Button>
        <Box>
          <Typography variant="overline" sx={{ color: '#0891B2', fontWeight: 700, letterSpacing: '0.12em' }}>
            Word Spelling
          </Typography>
          <Typography variant="h4" fontWeight={800}>Unscramble it 📝</Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {phase === 'idle' && (
        <Box sx={{
          textAlign: 'center', p: 5, borderRadius: '24px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Typography variant="h2" mb={2}>📝</Typography>
          <Typography variant="h5" fontWeight={700} mb={1}>Ready to spell?</Typography>
          <Typography color="text.secondary" mb={4}>5 scrambled words · use hints if you're stuck!</Typography>
          <ToggleButtonGroup value={difficulty} exclusive onChange={(_, v) => v && setDifficulty(v)} sx={{ mb: 3 }}>
            <ToggleButton value="EASY">Easy</ToggleButton>
            <ToggleButton value="MEDIUM">Medium</ToggleButton>
            <ToggleButton value="HARD">Hard</ToggleButton>
          </ToggleButtonGroup>
          <br />
          <Button variant="contained" size="large" onClick={handleStart} disabled={loading} sx={{ mt: 1, px: 5 }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Start Game 🚀'}
          </Button>
        </Box>
      )}

      {phase === 'playing' && currentWord && (
        <Box>
          {/* Progress */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Chip label={`Word ${current + 1} / ${words.length}`}
              sx={{ background: 'rgba(8,145,178,0.15)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.3)', fontWeight: 700 }} />
            <Chip label={`${score} pts`}
              sx={{ background: 'rgba(168,85,247,0.15)', color: '#C084FC', border: '1px solid rgba(168,85,247,0.3)', fontWeight: 700 }} />
          </Box>

          {/* Word card */}
          <Box sx={{
            p: 4, textAlign: 'center', mb: 3, borderRadius: '20px',
            background: feedback === 'correct' ? 'rgba(52,211,153,0.08)'
              : feedback === 'wrong' ? 'rgba(248,113,113,0.08)'
              : 'rgba(255,255,255,0.04)',
            border: `1px solid ${feedback === 'correct' ? 'rgba(52,211,153,0.4)'
              : feedback === 'wrong' ? 'rgba(248,113,113,0.4)'
              : 'rgba(255,255,255,0.08)'}`,
            transition: 'all 0.3s',
          }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600} mb={2} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Unscramble this word
            </Typography>

            {/* Scrambled letters */}
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" mb={2}>
              {currentWord.scrambled.toUpperCase().split('').map((letter, i) => (
                <Box key={i} sx={{
                  width: 44, height: 52, borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(8,145,178,0.2), rgba(52,211,153,0.2))',
                  border: '1px solid rgba(34,211,238,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', fontWeight: 900, fontFamily: 'monospace',
                  color: '#22D3EE',
                }}>
                  {letter}
                </Box>
              ))}
            </Box>

            {showHint && (
              <Box sx={{
                py: 1.5, px: 2.5, borderRadius: '10px', mt: 1,
                background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
                display: 'flex', alignItems: 'center', gap: 1,
              }}>
                <LightbulbIcon sx={{ color: '#FBBF24', fontSize: 18 }} />
                <Typography variant="body2" color="warning.main" fontWeight={600}>
                  {currentWord.hint}
                </Typography>
              </Box>
            )}

            {feedback === 'correct' && <Typography variant="h4" mt={2} color="success.main">✅ Correct!</Typography>}
            {feedback === 'wrong' && (
              <Typography variant="h5" mt={2} color="error.main">
                ❌ It was: <strong>{currentWord.word}</strong>
              </Typography>
            )}
          </Box>

          {!feedback && (
            <>
              <Box display="flex" gap={2} mb={2}>
                <TextField fullWidth placeholder="Type your answer" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitAnswer()}
                  autoFocus
                  inputProps={{ style: { fontSize: '1.4rem', textAlign: 'center', fontWeight: 700, fontFamily: 'monospace' } }}
                />
                <Button variant="contained" size="large" onClick={submitAnswer} disabled={!input.trim()} sx={{ px: 3 }}>
                  →
                </Button>
              </Box>
              <Box display="flex" gap={2}>
                <Button fullWidth variant="outlined" startIcon={<LightbulbIcon />}
                  onClick={() => setShowHint(true)} disabled={showHint}
                  sx={{ borderColor: 'rgba(251,191,36,0.4)', color: '#FBBF24', '&:hover': { borderColor: '#FBBF24', background: 'rgba(251,191,36,0.08)' } }}>
                  Hint (−5 pts)
                </Button>
                <Button fullWidth variant="outlined" onClick={skipWord}
                  sx={{ borderColor: 'rgba(248,113,113,0.3)', color: '#F87171', '&:hover': { borderColor: '#F87171', background: 'rgba(248,113,113,0.08)' } }}>
                  Skip
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}

      {phase === 'finished' && (
        <Box sx={{
          textAlign: 'center', p: 5, borderRadius: '24px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Typography variant="h2" mb={2}>🎉</Typography>
          <Typography variant="h4" fontWeight={800} mb={1}>Round Complete!</Typography>
          <Typography color="text.secondary" mb={3}>
            {correct} / {words.length} words spelled correctly
          </Typography>
          <Box display="flex" justifyContent="center" mb={4}><ScoreBadge score={score} label="Total Score" /></Box>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button variant="contained" size="large" onClick={handleStart} disabled={loading}>Play Again</Button>
            <ToggleButtonGroup value={difficulty} exclusive onChange={(_, v) => v && setDifficulty(v)}>
              <ToggleButton value="EASY">Easy</ToggleButton>
              <ToggleButton value="MEDIUM">Medium</ToggleButton>
              <ToggleButton value="HARD">Hard</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {!currentProfile && <Alert severity="warning" sx={{ mt: 3 }}>Select a profile to save your score!</Alert>}
        </Box>
      )}
    </Container>
  );
}
