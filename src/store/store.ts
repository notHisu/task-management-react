import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthTokens } from "../types/Auth";
import { UserLoginSchema } from "../schemas/userSchema";
import { deleteCookie } from "../utils/cookieUtils";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (
        credentials: UserLoginSchema,
        loginFn: (creds: UserLoginSchema) => Promise<AuthTokens> // ✅ Function that returns a Promise
      ) => {
        set({ isLoading: true, error: null });
        try {
          const token = await loginFn(credentials); // Now this works!

          set({
            user: {
              email: credentials.email,
              token: token,
            },
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
            isLoading: false,
            user: null,
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Delete all authentication cookies
          deleteCookie("access_token");
          deleteCookie("refresh_token");
          deleteCookie("token_type");

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
      partialize: (state) => ({
        // Don't persist sensitive token information to localStorage
        user: state.user ? { email: state.user.email } : null,
      }),
    }
  )
);
