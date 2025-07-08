import { create } from "zustand";
import { Player } from "../interfaces/game/player";

interface UpdateRoleStoreState {
  player: Player | null;
  setPlayer: (player: Player) => void;
  reset: () => void;
}

export const useUpdateRoleStore = create<UpdateRoleStoreState>((set) => ({
  player: null,
  setPlayer: (player) => set({ player: player }),
  reset: () => set({ player: null }),
}));
