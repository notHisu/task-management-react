import axios, { AxiosError } from "axios";
import { UserCreateSchema, UserLoginSchema } from "../schemas/userSchema";
import useAuthStore from "../store";
interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);

    const state = useAuthStore.getState();
    const token = state.user?.token?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.statusText);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export const login = async (
  userData: UserLoginSchema
): Promise<ApiResponse<UserLoginSchema>> => {
  try {
    const response = await authApi.post("/login", userData);
    console.log("Login response:", response);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      error: axiosError.response?.data?.message || "Login failed",
      success: false,
    };
  }
};

export const register = async (
  userData: UserCreateSchema
): Promise<ApiResponse<UserCreateSchema>> => {
  try {
    const response = await authApi.post("/register", userData);
    return {
      data: response.data,
      success: true,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      error: axiosError.response?.data?.message || "Registration failed",
      success: false,
    };
  }
};
