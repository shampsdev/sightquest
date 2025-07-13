import { create } from "zustand";
import { GameOverlay } from "../interfaces/game/game-overlays";

interface OverlayState {
  overlay: GameOverlay;
}

interface OverlayActions {
  setOpenedOverlay: (overlay: GameOverlay) => void;
}

export const useOverlayStore = create<OverlayState & OverlayActions>(
  (set) => ({
    overlay: null,
    setOpenedOverlay: (overlay) => set({ overlay }),
  })
);
