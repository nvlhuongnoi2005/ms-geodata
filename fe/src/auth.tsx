import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  scopes: string[];
};

type TokenResponse = { access_token: string; user: AuthUser };
type AuthContextValue = { user: AuthUser | null; isLoading: boolean; accessToken: string | null };

const AuthContext = createContext<AuthContextValue | null>(null);

function csrfToken(): string | undefined {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrf_token="))
    ?.slice("csrf_token=".length);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      if (import.meta.env.VITE_GEODATA_DEMO === "true") {
        setAccessToken("demo-only-token");
        setUser({ id: "demo-admin", name: "Geodata Admin", email: "admin@local", role: "admin", scopes: [] });
        setIsLoading(false);
        return;
      }

      const headers = new Headers({ "Content-Type": "application/json" });
      const csrf = csrfToken();
      if (csrf) headers.set("X-CSRF-Token", csrf);
      try {
        const response = await fetch("/auth/refresh", {
          method: "POST",
          headers,
          credentials: "include",
          body: "{}"
        });
        if (response.ok) {
          const payload = (await response.json()) as TokenResponse;
          setAccessToken(payload.access_token);
          setUser(payload.user);
        }
      } finally {
        setIsLoading(false);
      }
    };
    void restore();
  }, []);

  const value = useMemo(() => ({ user, isLoading, accessToken }), [accessToken, isLoading, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

