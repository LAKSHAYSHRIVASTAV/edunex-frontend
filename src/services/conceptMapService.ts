import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const API = axios.create({
  baseURL: "https://edunex-backend-rj22.onrender.com/api", // ✅ IMPORTANT
});

/* ================= CONCEPT MAP API ================= */

export const conceptMapAPI = {
  generate: async (data: any) => {
    const res = await API.post("/concept-maps/generate", data);
    return res.data;
  },

  getAll: async (userId: string) => {
    const res = await API.get(`/concept-maps/user/${userId}`);
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await API.get(`/concept-maps/map/${id}`);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await API.delete(`/concept-maps/map/${id}`);
    return res.data;
  },
};