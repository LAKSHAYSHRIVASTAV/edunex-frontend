
import axios from "axios";

const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const envBaseUrl = import.meta.env.VITE_API_URL;
const defaultProductionApi = "https://edunex-backend-rj22.onrender.com/api";

const resolvedBaseUrl = envBaseUrl || defaultProductionApi;

const API = axios.create({
  baseURL: resolvedBaseUrl,
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
