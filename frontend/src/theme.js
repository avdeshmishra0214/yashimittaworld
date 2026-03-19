import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A855F7',
      light: '#C084FC',
      dark: '#7C3AED',
    },
    secondary: {
      main: '#22D3EE',
      light: '#67E8F9',
      dark: '#0891B2',
    },
    success: {
      main: '#34D399',
      light: '#6EE7B7',
    },
    warning: {
      main: '#FBBF24',
      light: '#FDE68A',
    },
    error: {
      main: '#F87171',
    },
    info: {
      main: '#818CF8',
    },
    background: {
      default: '#0B0B1A',
      paper: '#13112A',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Nunito", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none', fontSize: '0.95rem', letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0B0B1A 0%, #130D2E 40%, #0B1628 100%)',
          minHeight: '100vh',
          backgroundAttachment: 'fixed',
        },
        '*::-webkit-scrollbar': { width: 6 },
        '*::-webkit-scrollbar-track': { background: '#13112A' },
        '*::-webkit-scrollbar-thumb': { background: '#A855F7', borderRadius: 3 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 28px',
          fontWeight: 700,
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)' },
          '&:active': { transform: 'translateY(0px)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          boxShadow: '0 4px 20px rgba(168, 85, 247, 0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9, #9333EA)',
            boxShadow: '0 6px 24px rgba(168, 85, 247, 0.5)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #0891B2, #22D3EE)',
          boxShadow: '0 4px 20px rgba(34, 211, 238, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0E7490, #06B6D4)',
            boxShadow: '0 6px 24px rgba(34, 211, 238, 0.45)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.8rem',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px !important',
          fontWeight: 700,
          border: '1px solid rgba(168, 85, 247, 0.3)',
          color: '#94A3B8',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            color: '#fff',
            boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255,255,255,0.04)',
            '& fieldset': { borderColor: 'rgba(168, 85, 247, 0.3)' },
            '&:hover fieldset': { borderColor: '#A855F7' },
            '&.Mui-focused fieldset': { borderColor: '#A855F7', borderWidth: 2 },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(11, 11, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: 'rgba(255,255,255,0.08)',
        },
      },
    },
  },
});

export default theme;
