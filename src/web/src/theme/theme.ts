import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a', // Slate 900
      light: '#334155',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563eb', // Blue 600
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    status: {
      inTransit: '#0284c7', // Sky 600
      delivered: '#16a34a', // Green 600
      delayed: '#d97706',   // Amber 600
      exception: '#dc2626', // Red 600
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface Palette {
    status: {
      inTransit: string;
      delivered: string;
      delayed: string;
      exception: string;
    };
  }
  interface PaletteOptions {
    status?: {
      inTransit: string;
      delivered: string;
      delayed: string;
      exception: string;
    };
  }
}
