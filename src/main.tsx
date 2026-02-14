import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "./index.css";

// 🔹 Clear old stored auth/session data for fresh start
localStorage.clear();
sessionStorage.clear();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    {/* 🔔 Global toast notifications */}
    <Toaster position="top-right" reverseOrder={false} />
  </React.StrictMode>
);
