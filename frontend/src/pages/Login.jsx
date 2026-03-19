import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Divider, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/api';
import { auth } from '../utils/auth';

export default function Login({ onLogin }) {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(form);
      auth.saveSession(res.data.token, { username: res.data.username, userId: res.data.userId });
      onLogin({ username: res.data.username, userId: res.data.userId });
      navigate('/profiles');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      {/* Brand */}
      <Box textAlign="center" mb={5}>
        <Typography variant="h2" mb={1}>✨</Typography>
        <Typography sx={{
          fontFamily: '"Orbitron", sans-serif', fontWeight: 900, fontSize: '1.4rem',
          background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          YashiMittaWorld
        </Typography>
        <Typography color="text.secondary" mt={1}>Sign in to your account</Typography>
      </Box>

      <Box
        component="form" onSubmit={submit}
        sx={{
          p: 4, borderRadius: '24px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth label="Username" name="username"
          value={form.username} onChange={handle}
          sx={{ mb: 2 }} autoFocus autoComplete="username"
        />
        <TextField
          fullWidth label="Password" name="password" type="password"
          value={form.password} onChange={handle}
          sx={{ mb: 3 }} autoComplete="current-password"
        />

        <Button
          type="submit" variant="contained" fullWidth size="large"
          disabled={loading || !form.username || !form.password}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
        </Button>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography textAlign="center" color="text.secondary" variant="body2">
          Don't have an account?{' '}
          <Typography component={Link} to="/register"
            sx={{ color: '#A855F7', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Create one
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
}
