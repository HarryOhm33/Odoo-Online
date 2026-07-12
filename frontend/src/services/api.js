// src/services/api.js
// Axios instance with request/response interceptors.
// All API calls should use this instance instead of raw axios.

import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// ── Request interceptor — attach JWT token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("magicalKey");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 globally ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("magicalKey");
      // Hard redirect to login — avoids stale context state issues
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
