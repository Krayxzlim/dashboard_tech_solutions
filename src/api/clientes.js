import { apiClient } from "./client";

export const clientesApi = {
  list: ({ page = 1, per_page = 20 } = {}) =>
    apiClient.get("/api/clientes", { params: { page, per_page } }).then((r) => r.data),
  getById: (id) => apiClient.get(`/api/clientes/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post("/api/clientes", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/api/clientes/${id}`, payload).then((r) => r.data),
  deactivate: (id) => apiClient.delete(`/api/clientes/${id}`).then((r) => r.data),
};
