import { apiClient } from "./client";

export const ESTADOS_CASO = ["asignado", "en_atención", "en_progreso", "resuelto", "escalado"];

export const casosApi = {
  list: ({ page = 1, per_page = 20, consultor_id, estado_caso } = {}) =>
    apiClient
      .get("/api/casos", { params: { page, per_page, consultor_id, estado_caso } })
      .then((r) => r.data),
  getById: (id) => apiClient.get(`/api/casos/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post("/api/casos", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/api/casos/${id}`, payload).then((r) => r.data),
};
