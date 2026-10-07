import { alpha, createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#df1743", dark: "#a9072d", light: "#fff0f3", contrastText: "#ffffff" },
    secondary: { main: "#097d71", dark: "#04584f", light: "#e6f7f3" },
    background: { default: "#f5f7f7", paper: "#ffffff" },
    text: { primary: "#15252b", secondary: "#607178" },
    success: { main: "#16806e" },
    warning: { main: "#a96108" },
    error: { main: "#be173b" }
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: { fontWeight: 780, letterSpacing: "-0.04em" },
    h4: { fontWeight: 760, letterSpacing: "-0.032em" },
    h5: { fontWeight: 750, letterSpacing: "-0.025em" },
    h6: { fontWeight: 720, letterSpacing: "-0.015em" },
    subtitle1: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700, letterSpacing: "0" }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { margin: 0, backgroundColor: "#f5f7f7" },
        "::selection": { backgroundColor: alpha("#df1743", 0.18) }
      }
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: {
      styleOverrides: {
        root: { minHeight: 42, borderRadius: 11, paddingInline: 16 },
        contained: { boxShadow: "0 8px 18px rgb(223 23 67 / 22%)" }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: { "& .MuiOutlinedInput-root": { borderRadius: 12, backgroundColor: "#fff" } }
      }
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 700 } } }
  }
});
