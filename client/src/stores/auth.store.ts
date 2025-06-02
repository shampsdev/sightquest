import { create } from "zustand";

interface AuthState {
  auth: boolean;
}

interface AuthActions {
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  auth: false,
  login: () => set(() => ({ auth: true })),
  logout: () => set(() => ({ auth: false })),
}));
