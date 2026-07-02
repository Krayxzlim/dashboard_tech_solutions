import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { authApi } from "../api/auth";
import { usuariosApi } from "../api/usuarios";
import {
  getTokens,
  setTokens,
  clearTokens,
  getStoredUser,
  setStoredUser,
} from "../utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const { accessToken } = getTokens();
    if (!accessToken) {
      setIsBooting(false);
      return;
    }

    if (!user) {
      clearTokens();
    }
    setIsBooting(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const { access_token, refresh_token, user: loggedUser } = res.data;
    setTokens({ accessToken: access_token, refreshToken: refresh_token });
    setStoredUser(loggedUser);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload);
    const { access_token, refresh_token, usuario } = res.data;
    setTokens({ accessToken: access_token, refreshToken: refresh_token });
    setStoredUser(usuario);
    setUser(usuario);
    return usuario;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user?.usuario_id) return null;
    const res = await usuariosApi.getById(user.usuario_id);
    return res.data;
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBooting,
      login,
      register,
      logout,
      fetchProfile,
    }),
    [user, isBooting, login, register, logout, fetchProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
