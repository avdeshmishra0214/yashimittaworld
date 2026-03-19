import { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Box, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Avatar, CircularProgress,
  Alert, IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { profilesApi } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AVATARS = ['🦁', '🐸', '🐼', '🦊', '🐙', '🦄', '🐧', '🐯', '🦋', '🐬', '🦕', '🦖'];

export default function ProfileSelect({ onSelectProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [creating, setCreating] = useState(false);
  const [hoverId, setHoverId] = useState(null);
  const navigate = useNavigate();

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const res = await profilesApi.getAll();
      setProfiles(res.data);
    } catch {
      setError('Could not load profiles. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfiles(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await profilesApi.create({ name: newName.trim(), avatar: selectedAvatar });
      setDialogOpen(false);
      setNewName('');
      setSelectedAvatar(AVATARS[0]);
      loadProfiles();
    } catch {
      setError('Failed to create profile.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await profilesApi.delete(id);
    loadProfiles();
  };

  const handleSelect = (profile) => {
    onSelectProfile(profile);
    navigate('/games');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header */}
      <Box textAlign="center" mb={7}>
        <Typography variant="overline" sx={{ color: '#A855F7', fontWeight: 700, letterSpacing: '0.15em' }}>
          Welcome to
        </Typography>
        <Typography variant="h2" fontWeight={900} mb={1}
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >
          YashiMittaWorld
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={400}>
          Choose your player to begin your adventure
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress sx={{ color: '#A855F7' }} size={56} thickness={3} />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {profiles.map(p => (
            <Grid item xs={6} sm={4} md={3} key={p.id}>
              <Box
                onClick={() => handleSelect(p)}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
                sx={{
                  position: 'relative', cursor: 'pointer',
                  borderRadius: '20px', p: '1.5px',
                  background: hoverId === p.id
                    ? 'linear-gradient(135deg, #7C3AED, #22D3EE)'
                    : 'rgba(255,255,255,0.08)',
                  transition: 'all 0.25s ease',
                  transform: hoverId === p.id ? 'translateY(-4px)' : 'none',
                  boxShadow: hoverId === p.id ? '0 12px 40px rgba(168,85,247,0.3)' : 'none',
                }}
              >
                <Box sx={{
                  borderRadius: '19px',
                  background: 'rgba(11,11,26,0.9)',
                  backdropFilter: 'blur(20px)',
                  py: 3, px: 2, textAlign: 'center',
                }}>
                  <Tooltip title="Delete profile">
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute', top: 8, right: 8,
                        opacity: hoverId === p.id ? 1 : 0,
                        transition: 'opacity 0.2s',
                        color: '#F87171',
                        '&:hover': { background: 'rgba(248,113,113,0.1)' },
                      }}
                      onClick={(e) => handleDelete(e, p.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{
                    width: 64, height: 64, borderRadius: '50%', mx: 'auto', mb: 1.5,
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.3))',
                    border: '2px solid rgba(168,85,247,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32,
                  }}>
                    {p.avatar}
                  </Box>
                  <Typography fontWeight={700} color="text.primary">{p.name}</Typography>
                  {hoverId === p.id && (
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mt={0.5}>
                      <CheckCircleIcon sx={{ fontSize: 14, color: '#34D399' }} />
                      <Typography variant="caption" color="success.main" fontWeight={600}>Play</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}

          {/* Add new */}
          <Grid item xs={6} sm={4} md={3}>
            <Box
              onClick={() => setDialogOpen(true)}
              sx={{
                cursor: 'pointer', borderRadius: '20px', p: '1.5px',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px dashed rgba(34,211,238,0.4)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(168,85,247,0.2))',
                  borderColor: '#22D3EE',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(34,211,238,0.2)',
                },
              }}
            >
              <Box sx={{
                borderRadius: '19px', py: 3, px: 2, textAlign: 'center',
              }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: '50%', mx: 'auto', mb: 1.5,
                  background: 'rgba(34,211,238,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AddIcon sx={{ fontSize: 32, color: '#22D3EE' }} />
                </Box>
                <Typography fontWeight={700} color="secondary.main">New Player</Typography>
                <Typography variant="caption" color="text.secondary">Create profile</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs" fullWidth
        PaperProps={{
          sx: {
            background: '#13112A', border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: '20px', backdropFilter: 'blur(20px)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.3rem', pb: 1 }}>
          Create Your Player ✨
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth label="Enter your name" value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            sx={{ mt: 1, mb: 3 }} inputProps={{ maxLength: 20 }}
          />
          <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.secondary">
            Choose your avatar
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1.5}>
            {AVATARS.map(av => (
              <Box
                key={av}
                onClick={() => setSelectedAvatar(av)}
                sx={{
                  width: 48, height: 48, borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, cursor: 'pointer', transition: 'all 0.15s',
                  background: selectedAvatar === av
                    ? 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(34,211,238,0.4))'
                    : 'rgba(255,255,255,0.06)',
                  border: selectedAvatar === av
                    ? '2px solid #A855F7' : '2px solid rgba(255,255,255,0.08)',
                  transform: selectedAvatar === av ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: selectedAvatar === av ? '0 0 12px rgba(168,85,247,0.5)' : 'none',
                }}
              >
                {av}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleCreate}
            disabled={creating || !newName.trim()}
          >
            {creating ? 'Creating...' : "Let's Go! 🚀"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
