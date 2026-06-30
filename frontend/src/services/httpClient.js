import axios from "axios";
import { clearAuthStorage, getToken } from "./tokenStorage.js";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error, fallback = "Something went wrong") {
  return error?.response?.data?.message || error?.message || fallback;
}
