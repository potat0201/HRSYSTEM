import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { useMemo, useState } from "react";
import { authApi } from "../features/auth/api/auth.api.js";
import { AuthContext } from "../features/auth/hooks/useAuth.js";
import {
  clearAuthStorage,
  getCurrentUser,
  setCurrentUser,
  setToken,
} from "../services/tokenStorage.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f6feb",
      dark: "#174ea6",
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
});

export function AppProviders({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const authValue = useMemo(
    () => ({
      user,
      setSession(loginData) {
        setToken(loginData.token);
        setCurrentUser(loginData);
        setUser(loginData);
      },
      async logout() {
        try {
          if (user?.userId) {
            await authApi.logout(user.userId);
          }
        } finally {
          clearAuthStorage();
          setUser(null);
        }
      },
    }),
    [user],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3500}>
          <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
