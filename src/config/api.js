
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
  timeout: 90000, // allow Render cold starts + AI generation for larger docs
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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message =
        "The request took too long. Please try again in a few seconds.";
    } else if (!error.response) {
      error.message =
        "Unable to reach the server. Please wait for the backend to wake up and try again.";
    }

    return Promise.reject(error);
  }
);

export default API;
