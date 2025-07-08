import { useCallback, useState } from "react";
import { OverlayPropsMap } from "../interfaces/game/game-overlays";

export type OverlayKey = keyof OverlayPropsMap;

export const useGameOverlays = () => {
  const [openedOverlay, setOpenedOverlay] = useState<OverlayKey | null>(null);
  const [overlayProps, setOverlayProps] = useState<
    Partial<OverlayPropsMap[keyof OverlayPropsMap]>
  >({});

  function openOverlay<T extends OverlayKey>(
    overlay: T,
    props: OverlayPropsMap[T]
  ) {
    setOpenedOverlay(overlay);
    setOverlayProps(props);
  }

  const closeOverlay = useCallback(() => {
    setOpenedOverlay(null);
    setOverlayProps({});
  }, []);

  const isOverlayOpen = useCallback(
    <T extends OverlayKey>(overlay: T): boolean => openedOverlay === overlay,
    [openedOverlay]
  );

  function getOverlayProps<T extends OverlayKey>(): OverlayPropsMap[T] {
    return overlayProps as OverlayPropsMap[T];
  }

  return {
    openedOverlay,
    overlayProps,
    openOverlay,
    closeOverlay,
    isOverlayOpen,
    isAnyOverlayOpen: openedOverlay !== null,
    getOverlayProps,
  };
};
