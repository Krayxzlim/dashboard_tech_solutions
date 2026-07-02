import { apiClient } from "./client";

export const usuariosApi = {
  list: () => apiClient.get("/api/usuarios").then((r) => r.data),
  getById: (id) => apiClient.get(`/api/usuarios/${id}`).then((r) => r.data),
};
