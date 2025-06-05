// useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";
import toast from "react-hot-toast";

let isRefreshing = false;
let refreshPromise = null;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // ✅ Hydration state
      hasHydrated: false,
      setHasHydrated: () => set({ hasHydrated: true }),

      setAccessToken: (token) => {
        set({ accessToken: token, isAuthenticated: !!token });
      },

      setUser: (userData) => {
        set({ user: userData, isAuthenticated: !!userData });
      },

      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post("/auth/login", { email, password });
          const { user, accessToken, message } = response.data;

          set({
            user,
            accessToken,
            isAuthenticated: true,
            loading: false,
            error: null
          });
          
          toast.success(message || "Login successful");
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null
          });
          return {
            success: false,
            error: errorMessage,
          };
        }
      },

      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post("/auth/register", userData);
          const { user, accessToken , message} = response.data;

          set({
            user,
            accessToken,
            isAuthenticated: true,
            loading: false,
          });
          toast.success(message)
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Registration failed",
            loading: false,
          });
          return {
            success: false,
            error: error.response?.data?.message || "Registration failed",
          };
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            error: null,
          });
          localStorage.removeItem("auth-storage");
        }
      },

      checkAuth: async () => {
        if (isRefreshing) return refreshPromise;

        isRefreshing = true;
        refreshPromise = api
          .get("/auth/refresh")
          .then((response) => {
            const { user, accessToken } = response.data;
            set({
              user,
              accessToken,
              isAuthenticated: true,
              loading: false,
            });
            return true;
          })
          .catch((error) => {
            console.log(
              "Refresh failed:",
              error.response?.data?.message || error.message
            );
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              loading: false,
            });
            return false;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });

        return refreshPromise;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        get().setHasHydrated(); // ✅ Set hydration flag when storage is loaded
      },
    }
  )
);
