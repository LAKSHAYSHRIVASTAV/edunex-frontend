
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://edunex-backend-rj22.onrender.com/api",
  timeout: 20000, // 20s (important for Render cold start)
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
