import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth";
import { theme } from "./theme";
import { AdminShell } from "./components/AdminShell";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AdminShell />
      </AuthProvider>
    </ThemeProvider>
  );
}

