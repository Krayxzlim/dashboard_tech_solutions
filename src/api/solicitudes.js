import { apiClient } from "./client";

export const ESTADOS_SOLICITUD = ["pendiente", "en_revisión", "aprobada", "rechazada", "resuelta"];

export const solicitudesApi = {
  list: ({ page = 1, per_page = 20, cliente_id, estado_solicitud } = {}) =>
    apiClient
      .get("/api/solicitudes", { params: { page, per_page, cliente_id, estado_solicitud } })
      .then((r) => r.data),
  getById: (id) => apiClient.get(`/api/solicitudes/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post("/api/solicitudes", payload).then((r) => r.data),
  updateEstado: (id, estado_solicitud) =>
    apiClient.put(`/api/solicitudes/${id}/estado`, { estado_solicitud }).then((r) => r.data),
};
