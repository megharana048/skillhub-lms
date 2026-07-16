import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

function saveSession(token, user) {
  localStorage.setItem("skillhub_token", token);
  localStorage.setItem("skillhub_user", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("skillhub_token");
  localStorage.removeItem("skillhub_user");
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillhub_user")) || null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      if (!localStorage.getItem("skillhub_token")) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("skillhub_user", JSON.stringify(data.user));
      } catch {
        clearSession();
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    restore();
  }, []);

  const login = useCallback(async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    saveSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    saveSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    setUser(data.user);
    localStorage.setItem("skillhub_user", JSON.stringify(data.user));
    return data.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, isAuthLoading, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}

export { AuthProvider, useAuth };
