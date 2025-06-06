import { MAPBOX_STYLE_URL, MAPBOX_TOKEN } from "@/constants";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { JSX } from "react";
import { twMerge } from "tailwind-merge";

Mapbox.setAccessToken(MAPBOX_TOKEN);

interface MapProps {
  children?: React.ReactNode;
  className?: string;
}

export const Map = ({ children, className }: MapProps) => {
  return (
    <MapView
      logoEnabled={false}
      scaleBarEnabled={false}
      attributionEnabled={false}
      styleURL={MAPBOX_STYLE_URL}
      className={twMerge("flex-1", className)}
    >
      {children}
    </MapView>
  );
};
