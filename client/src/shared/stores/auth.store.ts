import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../interfaces/user";

interface AuthState {
  auth: boolean;
  token: string | null;
  user: User | null;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      auth: false,
      token: null,
      user: null,
      login: (user: User, token: string) => set({ auth: true, user, token }),
      logout: () => set({ auth: false, user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
