import axios, { AxiosError } from "axios";
import { UserCreateSchema, UserLoginSchema } from "../schemas/userSchema";

// Create a base API instance
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API response type
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export const login = async (
  userData: UserLoginSchema
): Promise<ApiResponse<UserLoginSchema>> => {
  try {
    const response = await authApi.post("/login", userData);
    console.log("Login response:", response.data);
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

export default authApi;
