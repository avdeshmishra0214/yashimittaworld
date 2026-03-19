import { AppBar, Toolbar, Typography, Button, Box, Divider, Avatar, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { useState } from 'react';

export default function Navbar({ currentProfile, loggedInUser, onChangeProfile, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchor, setAnchor] = useState(null);

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1, minHeight: '68px !important' }}>
        {/* Brand */}
        <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: 'pointer', flexGrow: 1 }}
          onClick={() => navigate(loggedInUser ? '/games' : '/')}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #7C3AED, #22D3EE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(168,85,247,0.5)', fontSize: 18,
          }}>✨</Box>
          <Typography sx={{
            fontFamily: '"Orbitron", sans-serif', fontWeight: 900,
            fontSize: { xs: '0.85rem', sm: '1.05rem', md: '1.2rem' },
            background: 'linear-gradient(90deg, #A855F7, #22D3EE)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.04em',
          }}>
            YashiMittaWorld
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {loggedInUser && (
            <Button startIcon={<EmojiEventsIcon />} onClick={() => navigate('/leaderboard')}
              sx={{
                color: location.pathname === '/leaderboard' ? '#A855F7' : '#94A3B8',
                fontWeight: 600,
                '&:hover': { color: '#A855F7', background: 'rgba(168,85,247,0.1)' },
              }}>
              Leaderboard
            </Button>
          )}

          {loggedInUser ? (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(255,255,255,0.1)' }} />
              {/* Profile pill */}
              {currentProfile && (
                <Box display="flex" alignItems="center" gap={1} sx={{
                  px: 1.5, py: 0.5, borderRadius: '30px',
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(168,85,247,0.18)' },
                }} onClick={onChangeProfile}>
                  <Typography sx={{ fontSize: 18 }}>{currentProfile.avatar}</Typography>
                  <Typography variant="body2" fontWeight={600} color="primary.light" sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {currentProfile.name}
                  </Typography>
                </Box>
              )}

              {/* User menu */}
              <Box sx={{
                px: 1.5, py: 0.75, borderRadius: '30px', cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', gap: 1,
                '&:hover': { background: 'rgba(255,255,255,0.09)' },
              }} onClick={e => setAnchor(e.currentTarget)}>
                <Avatar sx={{ width: 26, height: 26, bgcolor: '#7C3AED', fontSize: 12, fontWeight: 700 }}>
                  {loggedInUser.username[0].toUpperCase()}
                </Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {loggedInUser.username}
                </Typography>
              </Box>

              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
                PaperProps={{ sx: { background: '#1A1635', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', mt: 1 } }}>
                <MenuItem onClick={() => { setAnchor(null); onChangeProfile(); }}
                  sx={{ gap: 1.5, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                  <ListItemIcon><SwitchAccountIcon fontSize="small" sx={{ color: '#A855F7' }} /></ListItemIcon>
                  Switch Player
                </MenuItem>
                <MenuItem onClick={() => { setAnchor(null); onLogout(); }}
                  sx={{ gap: 1.5, color: '#F87171', '&:hover': { background: 'rgba(248,113,113,0.08)' } }}>
                  <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#F87171' }} /></ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box display="flex" gap={1}>
              <Button variant="outlined" size="small" onClick={() => navigate('/login')}
                sx={{ borderColor: 'rgba(168,85,247,0.4)', color: '#A855F7' }}>
                Sign In
              </Button>
              <Button variant="contained" size="small" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
