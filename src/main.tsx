import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "./index.css";

// ✅ Clear storage ONLY in development (safe for production)
if (import.meta.env.DEV) {
  localStorage.clear();
  sessionStorage.clear();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />

    {/* 🔔 Global toast notifications */}
    <Toaster position="top-right" reverseOrder={false} />
  </React.StrictMode>
);