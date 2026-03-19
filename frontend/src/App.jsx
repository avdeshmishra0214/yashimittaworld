import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { auth } from './utils/auth';

import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';

import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSelect from './pages/ProfileSelect';
import GameHub from './pages/GameHub';
import Leaderboard from './pages/Leaderboard';

import MemoryGame from './games/MemoryGame/MemoryGame';
import MathGame from './games/MathGame/MathGame';
import WordGame from './games/WordGame/WordGame';
import PuzzleGame from './games/PuzzleGame/PuzzleGame';
import DrawGame from './games/DrawGame/DrawGame';

function RequireAuth({ loggedInUser, children }) {
  if (!loggedInUser) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => auth.getUser());
  const [currentProfile, setCurrentProfile] = useState(() => {
    const saved = localStorage.getItem('currentProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  const handleLogin = (user) => setLoggedInUser(user);

  const handleLogout = () => {
    auth.clear();
    setLoggedInUser(null);
    setCurrentProfile(null);
    navigate('/login');
  };

  const handleSelectProfile = (profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentProfile', JSON.stringify(profile));
  };

  const handleChangeProfile = () => {
    setCurrentProfile(null);
    localStorage.removeItem('currentProfile');
    navigate('/profiles');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar
          currentProfile={currentProfile}
          loggedInUser={loggedInUser}
          onChangeProfile={handleChangeProfile}
          onLogout={handleLogout}
        />
        <PageTransition>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={loggedInUser ? <Navigate to="/games" replace /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={loggedInUser ? <Navigate to="/games" replace /> : <Register onLogin={handleLogin} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Protected */}
            <Route path="/profiles" element={
              <RequireAuth loggedInUser={loggedInUser}>
                <ProfileSelect onSelectProfile={handleSelectProfile} />
              </RequireAuth>
            } />
            <Route path="/games" element={
              <RequireAuth loggedInUser={loggedInUser}>
                <GameHub currentProfile={currentProfile} />
              </RequireAuth>
            } />
            <Route path="/games/memory" element={
              <RequireAuth loggedInUser={loggedInUser}>
                <MemoryGame currentProfile={currentProfile} />
              </RequireAuth>
            } />
            <Route path="/games/math" element={
              <RequireAuth loggedInUser={loggedInUser}>
                <MathGame currentProfile={currentProfile} />
              </RequireAuth>
            } />
            <Route path="/games/word" element={
              <RequireAuth loggedInUser={loggedInUser}>
                <WordGame currentProfile={currentProfile} />
              </RequireAuth>
            } />
            <Route path="/games/puzzle" element={
              <RequireAuth loggedInUser={loggedInUser}>
                <PuzzleGame currentProfile={currentProfile} />
              </RequireAuth>
            } />
            <Route path="/games/draw" element={
              <RequireAuth loggedInUser={loggedInUser}>
                <DrawGame currentProfile={currentProfile} />
              </RequireAuth>
            } />

            {/* Root redirect */}
            <Route path="/" element={
              <Navigate to={loggedInUser ? (currentProfile ? '/games' : '/profiles') : '/login'} replace />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </Box>
    </ThemeProvider>
  );
}
