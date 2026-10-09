import { AuthProvider } from "./auth";
import { AdminShell } from "./components/AdminShell";
import { AppearanceProvider } from "./components/AppearanceControls";
import { I18nProvider } from "./i18n";

export default function App() {
  return (
    <I18nProvider>
      <AppearanceProvider>
        <AuthProvider>
          <AdminShell />
        </AuthProvider>
      </AppearanceProvider>
    </I18nProvider>
  );
}
