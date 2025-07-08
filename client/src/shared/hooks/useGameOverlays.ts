import { useCallback, useState } from "react";
import { GameOverlay } from "../interfaces/game/game-overlays";

export const useGameOverlays = () => {
  const [openedOverlay, setOpenedOverlay] = useState<GameOverlay>(null);

  const openOverlay = useCallback((overlay: Exclude<GameOverlay, null>) => {
    setOpenedOverlay(overlay);
  }, []);

  const closeOverlay = useCallback(() => {
    setOpenedOverlay(null);
  }, []);

  const isOverlayOpen = (overlay: Exclude<GameOverlay, null>) =>
    openedOverlay === overlay;

  const isAnyOverlayOpen = openedOverlay !== null;

  return {
    openedOverlay,
    openOverlay,
    closeOverlay,
    isOverlayOpen,
    isAnyOverlayOpen,
  };
};
