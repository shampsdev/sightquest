import { create } from "zustand";
import { socketManager } from "../socket/socket-manager";
import { User } from "@/shared/interfaces/user";

export interface UserStoreState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStoreState>((set) => {
  socketManager.on("authed", ({ user }) => {
    set({ user });
    console.log(user);
  });

  return {
    user: null,
    setUser: (user) => set({ user }),
  };
});
