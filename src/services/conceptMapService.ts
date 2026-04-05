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
  (res) => res.data, // ✅ important
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
  generate: (data: any) => API.post("/concept-map", data),

  getAll: (userId: string) =>
    API.get(`/concept-map/${userId}`),

  getOne: (id: string) =>
    API.get(`/concept-map/single/${id}`),

  delete: (id: string) =>
    API.delete(`/concept-map/${id}`),

  updateLayout: (id: string, data: any) =>
    API.patch(`/concept-map/${id}/layout`, data), // 🔥 optional
};