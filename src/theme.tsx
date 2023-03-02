import { createTheme } from "@mui/material";
import blue from '@mui/material/colors/blue';


const theme = createTheme({
  typography: {
    button: {
      textTransform: "none"
    }
  },
  palette: {
    secondary: blue,
  },
  spacing: 4,
  components: {
    MuiTextField: {
        styleOverrides: {
            root: {
                backgroundColor: 'white'
            }
        }
    }
  }
});

export default theme;