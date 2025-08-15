import axios from "axios";
import { refreshToken } from "@/services/auth/refresh_token";

const API_URL = "https://lunalu07.ocloudxx.lat/api"; 

const api = axios.create({
  baseURL: API_URL,
});

// 🔒 Control de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Evitamos múltiples intentos
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      if (originalRequest.url.includes("/token/refresh")) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // Si ya está refrescando, metemos en la cola
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        const res = await refreshToken({ refresh });

        localStorage.setItem("token", res.access);

        processQueue(null, res.access);
        originalRequest.headers.Authorization = `Bearer ${res.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const fetchData = async (method, endpoint, data = null, token = null, isFormData = false) => {
  try {
    const headers = {
      ...(!isFormData && { "Content-Type": "application/json" }),
    };

    const config = {
      method,
      url: endpoint,
      data,
      headers,
    };

    const response = await api(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error desconocido", error };
  }
};

export default api;
