import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/reducers/userSlice";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://cryptobackend-8xgf.vercel.app";

// Create axios instance with base configuration
const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from Redux store
    if (typeof window !== "undefined") {
      const state = store.getState();
      const token = state.user.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      if (status === 401) {
        // Unauthorized - logout user from Redux
        if (typeof window !== "undefined") {
          store.dispatch(logout());
          // Optionally redirect to login page
          // window.location.href = "/login";
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Error in setting up the request
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default httpClient;
