import { alpha, createTheme, type PaletteMode } from "@mui/material/styles";

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";
  const palette = isDark
    ? {
        primary: { main: "#ff7894", dark: "#ffb7c5", light: "#56202b", contrastText: "#3a0712" },
        secondary: { main: "#62d9c1", dark: "#bff9ed", light: "#173c37" },
        background: { default: "#121a1d", paper: "#1a2529" },
        text: { primary: "#e9f3f2", secondary: "#aec0c0" },
        success: { main: "#6ee0c8" },
        warning: { main: "#ffbd68" },
        error: { main: "#ff9bb1" },
        divider: "#304044",
      }
    : {
        primary: { main: "#df1743", dark: "#a9072d", light: "#fff0f3", contrastText: "#ffffff" },
        secondary: { main: "#097d71", dark: "#04584f", light: "#e6f7f3" },
        background: { default: "#f5f7f7", paper: "#ffffff" },
        text: { primary: "#15252b", secondary: "#607178" },
        success: { main: "#16806e" },
        warning: { main: "#a96108" },
        error: { main: "#be173b" },
        divider: "#e0e7e6",
      };
  return createTheme({
    palette: { mode, ...palette },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h3: { fontWeight: 780, letterSpacing: "-0.04em" },
      h4: { fontWeight: 760, letterSpacing: "-0.032em" },
      h5: { fontWeight: 750, letterSpacing: "-0.025em" },
      h6: { fontWeight: 720, letterSpacing: "-0.015em" },
      subtitle1: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 700, letterSpacing: "0" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { margin: 0, backgroundColor: palette.background.default },
          "::selection": { backgroundColor: alpha(palette.primary.main, 0.25) },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiButton: {
        styleOverrides: {
          root: { minHeight: 42, borderRadius: 11, paddingInline: 16 },
          contained: {
            boxShadow: isDark ? "0 8px 18px rgb(0 0 0 / 28%)" : "0 8px 18px rgb(223 23 67 / 22%)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              backgroundColor: palette.background.paper,
            },
          },
        },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 700 } } },
    },
  });
}
