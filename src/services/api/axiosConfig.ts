import axios from "axios";
import { getCookie } from "../../utils/cookieUtils";
import { useAuthStore } from "../../store/store";

// Create base axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookie first, fallback to store
    const accessToken = getCookie("access_token");
    const tokenType = getCookie("token_type") || "Bearer";

    if (accessToken) {
      config.headers.Authorization = `${tokenType} ${accessToken}`;
    } else {
      // Fallback to store (for backward compatibility)
      const state = useAuthStore.getState();
      const storeToken = state.user?.token?.accessToken;
      if (storeToken) {
        config.headers.Authorization = `Bearer ${storeToken}`;
      }
    }

    if (import.meta.env.DEV) {
      console.log("Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("Response:", response.status, response.config.url);
    }
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Could implement token refresh here
        useAuthStore.getState().logout();
      }
    }
    console.error(
      "API Error Response:",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default apiClient;
