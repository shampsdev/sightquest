import { createContext, useContext, useState } from "react";
import {
  OverlayName,
  OverlayPropsMap,
  overlayRegistry,
} from "../interfaces/overlays";

type OverlayState = Partial<
  Record<OverlayName, { visible: boolean; props?: any }>
>;

interface OverlayContextValue {
  openOverlay<T extends OverlayName>(name: T, props?: OverlayPropsMap[T]): void;
  closeOverlay(name?: OverlayName): void;
  isOverlayOpen(name?: OverlayName): boolean;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

export const useOverlays = (): OverlayContextValue => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlays must be inside OverlayProvider");
  return ctx;
};

export const OverlayProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, setState] = useState<OverlayState>({});

  const openOverlay = <T extends OverlayName>(
    name: T,
    props?: OverlayPropsMap[T]
  ) => {
    setState((s) => ({ ...s, [name]: { visible: true, props } }));
  };

  const closeOverlay = (name?: OverlayName) => {
    if (name) {
      setState((s) => ({
        ...s,
        [name]: { ...(s[name] || {}), visible: false },
      }));
    } else {
      setState((s) => {
        const newState: OverlayState = {};
        Object.keys(s).forEach((key) => {
          const k = key as OverlayName;
          newState[k] = { ...(s[k] || {}), visible: false };
        });
        return newState;
      });
    }
  };

  const isOverlayOpen = (name?: OverlayName): boolean => {
    if (name) {
      return !!state[name]?.visible;
    }
    return Object.values(state).some((overlay) => overlay?.visible);
  };

  const ctxValue: OverlayContextValue = {
    openOverlay,
    closeOverlay,
    isOverlayOpen,
  };

  return (
    <OverlayContext.Provider value={ctxValue}>
      {children}
      {Object.entries(overlayRegistry).map(([name, Component]) => {
        const key = name as OverlayName;
        const entry = state[key];
        return (
          <Component
            key={key}
            visible={!!entry?.visible}
            onClose={() => closeOverlay(key)}
            {...(entry?.props ?? {})}
          />
        );
      })}
    </OverlayContext.Provider>
  );
};
