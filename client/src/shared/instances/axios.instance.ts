import { API_URL } from "@/constants";
import axios from "axios";
import { useAuthStore } from '../stores/auth.store';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers["X-Api-Token"] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
