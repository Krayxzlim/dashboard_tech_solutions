import { apiClient } from "./client";

export const planesApi = {
  list: () => apiClient.get("/api/planes").then((r) => r.data),
  getById: (id) => apiClient.get(`/api/planes/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post("/api/planes", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/api/planes/${id}`, payload).then((r) => r.data),
};
