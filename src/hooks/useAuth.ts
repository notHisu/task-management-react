import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserCreateSchema, UserLoginSchema } from "../schemas/userSchema";
import { setCookie } from "../utils/cookieUtils";
import apiClient from "../services/api/axiosConfig";
import { AuthTokens, User } from "../types/Auth";
import { toast } from "react-toastify";

// API response type
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

/**
 * Hook for authentication operations (login and register)
 */
export function useAuth() {
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (userData: UserLoginSchema): Promise<AuthTokens> => {
      try {
        const response = await apiClient.post<AuthTokens>(
          "/api/auth/login",
          userData
        );
        console.log("Login response:", response.data);

        // Store tokens in cookies if login successful
        if (response.data.accessToken) {
          setCookie(
            "access_token",
            response.data.accessToken,
            response.data.expiresIn || 3600
          );
          setCookie(
            "refresh_token",
            response.data.refreshToken,
            30 * 24 * 60 * 60 // 30 days for refresh token
          );
          setCookie(
            "token_type",
            response.data.tokenType || "Bearer",
            response.data.expiresIn || 3600
          );
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(axiosError.response?.data?.message || "Login failed");
      }
    },
    onSuccess: () => {
      toast.success("Login successful");
    },
    onError: () => {
      toast.error("Login failed");
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: UserCreateSchema): Promise<User> => {
      try {
        const response = await apiClient.post("/api/auth/register", userData);
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw new Error(
          axiosError.response?.data?.message || "Registration failed"
        );
      }
    },
    onSuccess: () => {
      toast.success("Registration successful");
    },
    onError: () => {
      toast.error("Registration failed");
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
  };
}
