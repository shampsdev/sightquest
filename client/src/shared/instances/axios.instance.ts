import { API_URL } from "@/constants";
import axios from "axios";
import { useAuthStore } from "../stores/auth.store";
import { logger } from "./logger.instance";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers["X-Api-Token"] = token;
    }
    return config;
  },
  (error) => {
    logger.error("http", "request error", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error("http", "response error", error);
    return Promise.reject(error);
  }
);
