import { useCallback, useState } from "react";
import {
  OverlayName,
  OverlayPropsMap,
  overlayRegistry,
} from "../interfaces/overlays";
import { OverlayContext } from "../hooks/useOverlays";

type OverlayState = Partial<
  Record<OverlayName, { visible: boolean; props?: any }>
>;

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

  const isOverlayOpen = useCallback(
    (name?: OverlayName): boolean => {
      if (name) {
        return !!state[name]?.visible;
      }
      return Object.values(state).some((overlay) => overlay?.visible);
    },
    [state]
  );

  return (
    <OverlayContext.Provider
      value={{
        openOverlay,
        closeOverlay,
        isOverlayOpen,
      }}
    >
      {children}
      {Object.entries(overlayRegistry).map(([name, Component]) => {
        const key = name as OverlayName;
        const entry = state[key];

        if (!entry?.visible) {
          return null;
        }

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
