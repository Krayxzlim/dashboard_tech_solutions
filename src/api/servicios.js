import { apiClient } from "./client";

export const AREAS_SERVICIO = [
  "finanzas",
  "marketing",
  "recursos_humanos",
  "desarrollo_web",
  "logistica",
  "inteligencia_artificial",
  "gestion_proyectos",
  "cumplimiento_legal",
];

export const serviciosApi = {
  list: ({ area, estado } = {}) =>
    apiClient.get("/api/servicios", { params: { area, estado } }).then((r) => r.data),
  getById: (id) => apiClient.get(`/api/servicios/${id}`).then((r) => r.data),
  byPlan: (planId) => apiClient.get(`/api/servicios/by-plan/${planId}`).then((r) => r.data),
  create: (payload) => apiClient.post("/api/servicios", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/api/servicios/${id}`, payload).then((r) => r.data),
};
