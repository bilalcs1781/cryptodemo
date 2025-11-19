import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = "https://cryptobackend-8xgf.vercel.app";

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
    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
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
        // Unauthorized - clear user data and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
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
