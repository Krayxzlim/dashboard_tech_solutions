import axios from "axios";
import { getTokens, setTokens, clearTokens } from "../utils/tokenStorage";

const BASE_URL = "";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// adjunta el access token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Manejo de refresh token
let isRefreshing = false;
let pendingQueue = [];

function resolveQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthRoute = originalRequest?.url?.includes("/api/auth/");

    // Timeout / sin respuesta del servidor
    if (!error.response) {
      error.friendlyMessage =
        "No se pudo conectar con el servidor. Verificá que el backend esté corriendo y la URL configurada en VITE_API_BASE_URL.";
      return Promise.reject(error);
    }

    if (status === 401 && !isAuthRoute && !originalRequest._retry) {
      const { refreshToken } = getTokens();
      if (!refreshToken) {
        clearTokens();
        window.location.assign("/login");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refresh_token: refreshToken,
        });
        const newAccess = data.data.access_token;
        const newRefresh = data.data.refresh_token;
        setTokens({ accessToken: newAccess, refreshToken: newRefresh });
        resolveQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        resolveQueue(refreshError, null);
        clearTokens();
        window.location.assign("/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    error.friendlyMessage =
      error.response?.data?.message ||
      (status === 404
        ? "No se encontró el recurso solicitado."
        : "Ocurrió un error inesperado. Intentá nuevamente.");
    return Promise.reject(error);
  },
);
