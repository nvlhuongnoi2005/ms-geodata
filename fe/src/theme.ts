import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#e0002b", dark: "#a90020", light: "#f2e8ea", contrastText: "#ffffff" },
    secondary: { main: "#087f73", light: "#e2f3f0", dark: "#04564e" },
    background: { default: "#eef2f1", paper: "#ffffff" },
    text: { primary: "#142a32", secondary: "#587078" },
    success: { main: "#087f73" },
    warning: { main: "#a75a00" },
    error: { main: "#ba1a1a" }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    subtitle1: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 }
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { margin: 0 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: {
      styleOverrides: {
        root: { minHeight: 40, borderRadius: 10 },
        contained: { boxShadow: "0 2px 5px rgb(224 0 43 / 24%)" }
      }
    }
  }
});

