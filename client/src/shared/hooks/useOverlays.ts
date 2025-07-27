import { createContext, useContext } from "react";
import { OverlayName, OverlayPropsMap } from "../interfaces/overlays";

interface OverlayContextValue {
  openOverlay: <T extends OverlayName>(
    name: T,
    props?: OverlayPropsMap[T]
  ) => void;
  closeOverlay: (name?: OverlayName) => void;
  isOverlayOpen: (name?: OverlayName) => boolean;
}

export const OverlayContext = createContext<OverlayContextValue | null>(null);

export const useOverlays = (): OverlayContextValue => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlays must be inside OverlayProvider");
  return ctx;
};
