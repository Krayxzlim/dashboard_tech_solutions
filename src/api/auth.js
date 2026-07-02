import { apiClient } from "./client";

export const authApi = {
  register: (payload) => apiClient.post("/api/auth/register", payload).then((r) => r.data),
  login: (payload) => apiClient.post("/api/auth/login", payload).then((r) => r.data),
  refresh: (refresh_token) =>
    apiClient.post("/api/auth/refresh", { refresh_token }).then((r) => r.data),
};
