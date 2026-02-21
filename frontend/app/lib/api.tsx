
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (
      originalRequest.url?.includes("login") ||
      originalRequest.url?.includes("token/refresh")
    ) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = api.post("token/refresh/");
        }

        await refreshPromise;
        isRefreshing = false;

        return api(originalRequest);

      } catch (refreshError) {
        isRefreshing = false;

      

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;