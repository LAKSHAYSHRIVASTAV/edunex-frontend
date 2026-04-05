import axios from "axios";

const API = axios.create({
  baseURL: "https://edunex-backend-rj22.onrender.com/api",
});

/* ================= AUTH ================= */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE CLEAN ================= */
API.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

/* ================= API ================= */
export const conceptMapAPI = {
  // ✅ FIXED ROUTES
  generate: (data: any) => API.post("/concept-maps/generate", data),

  getAll: (userId: string) =>
    API.get(`/concept-maps?userId=${userId}`),

  getOne: (id: string) =>
    API.get(`/concept-maps/${id}`),

  delete: (id: string) =>
    API.delete(`/concept-maps/${id}`),

  updateLayout: (id: string, data: any) =>
    API.patch(`/concept-maps/${id}/layout`, data),
};