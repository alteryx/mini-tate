import { createTheme } from '@mui/material';
import blue from '@mui/material/colors/blue';

// Copyright (c) 2023 Alteryx, Inc. All rights reserved.

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    secondary: blue,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
        },
      },
    },
  },
});

export default theme;
