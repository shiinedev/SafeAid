
import { create } from "zustand";
import { persist } from "zustand/middleware";


// Define the shape of your user object (customize as needed)
interface User {
  _id: string;
  username: string;
  email: string;
  role: Role;
  status:"active" | "deActive"
}

// Define the shape of the auth store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  getToken: () => string | null;
}

// Create the store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (userData, token) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      getToken: () => get().token,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
