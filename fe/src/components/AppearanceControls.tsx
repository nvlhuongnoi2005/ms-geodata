import { CssBaseline, IconButton, ThemeProvider, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useI18n } from "../i18n";
import { createAppTheme } from "../theme";

type ColorMode = "light" | "dark";

const STORAGE_KEY = "geodata_color_mode";
const AppearanceContext = createContext<{ mode: ColorMode; toggleMode: () => void } | null>(null);

function getInitialMode(): ColorMode {
  const storedMode = window.localStorage.getItem(STORAGE_KEY);

  if (storedMode === "light" || storedMode === "dark") return storedMode;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppearanceProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ColorMode>(getInitialMode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((currentMode) => (currentMode === "dark" ? "light" : "dark")),
    }),
    [mode]
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.colorMode = mode;
  }, [mode]);

  return (
    <AppearanceContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppearanceContext.Provider>
  );
}

export function ThemeModeSwitcher() {
  const appearance = useContext(AppearanceContext);
  const { t } = useI18n();

  if (!appearance) throw new Error("ThemeModeSwitcher must be used within AppearanceProvider");

  const isDark = appearance.mode === "dark";
  const label = t(isDark ? "theme.light" : "theme.dark");

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        aria-pressed={isDark}
        onClick={appearance.toggleMode}
        size="small"
        sx={{
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          "&:hover": { bgcolor: "action.hover" },
        }}
        type="button"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>
    </Tooltip>
  );
}
