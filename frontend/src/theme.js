// theme.js
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#4E6CF1FF',
    },
    secondary: {
      main: '#076827FF',
    },
  },
  typography: {
    fontFamily: `"Open Sans", "Arial", sans-serif`,
    fontWeightRegular: 600,
    fontWeightMedium: 700,
    fontWeightBold: 800,
  },
});

export default theme;
