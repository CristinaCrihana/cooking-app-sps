import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C890A7',
      light: '#C890A7',
      dark: '#C890A7',
      contrastText: '#fff',
    },
    secondary: {
      main: '#C890A7',
      light: '#C890A7',
      dark: '#C890A7',
      contrastText: '#000',
    },
    background: {
      default: '#FBF5E5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#A35C7A',
        },
      },
    },

  },
});

export default theme; 