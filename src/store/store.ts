import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types/Auth";
import { UserLoginSchema } from "../schemas/userSchema";
import { login as loginApi } from "../api/authApi";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (credentials: UserLoginSchema) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginApi(credentials);

          if (response.success && response.data) {
            set({
              user: {
                email: credentials.email,
              },
              isLoading: false,
              error: null,
            });
          } else {
            set({
              error: response.error || "Login failed",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: "An unexpected error occurred",
            isLoading: false,
            user: null,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const allCookies = document.cookie;

          const cookiesList = allCookies.split("; ");
          cookiesList.forEach((cookie) => {
            const cookieName = cookie.split("=")[0];

            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
          });
          set({
            user: null,
            isLoading: false,
          });
        } catch (error) {
          console.error("Logout error:", error);
          set({
            user: null,
            isLoading: false,
            error: "An unexpected error occurred during logout",
          });
        }
      },

      clearErrors: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
