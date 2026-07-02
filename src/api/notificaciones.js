import { apiClient } from "./client";

export const notificacionesApi = {
  list: ({ usuario_id, page = 1, per_page = 20, leida } = {}) =>
    apiClient
      .get("/api/notificaciones", { params: { usuario_id, page, per_page, leida } })
      .then((r) => r.data),
  create: (payload) => apiClient.post("/api/notificaciones", payload).then((r) => r.data),
  markAsRead: (id) =>
    apiClient.put(`/api/notificaciones/${id}/leida`).then((r) => r.data),
};
