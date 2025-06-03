import { MAPBOX_TOKEN } from "@/constants";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { JSX } from "react";

Mapbox.setAccessToken(MAPBOX_TOKEN);

interface MapProps {
  children?: React.ReactNode;
}

export const Map = ({ children }: MapProps) => {
  return (
    <MapView
      logoEnabled={false}
      scaleBarEnabled={false}
      attributionEnabled={false}
      styleURL="mapbox://styles/mikedegeofroy/cma57ielt004801s3gkciegzd"
      className="flex-1"
    >
      {children}
    </MapView>
  );
};
