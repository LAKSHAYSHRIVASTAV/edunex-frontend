import axios from "axios";

const API = axios.create({
  baseURL: "https://edunex-backend-rj22.onrender.com/api",
});

export const conceptMapAPI = {
  generate: async (data: any) => {
    const res = await API.post("/concept-maps/generate", data);
    return res.data; // ✅ MUST
  },

  getAll: async (userId: string) => {
    const res = await API.get(`/concept-maps/user/${userId}`);
    return res.data; // ✅ MUST
  },

  getOne: async (id: string) => {
    const res = await API.get(`/concept-maps/map/${id}`);
    return res.data; // ✅ MUST
  },

  delete: async (id: string) => {
    const res = await API.delete(`/concept-maps/map/${id}`);
    return res.data;
  },
};