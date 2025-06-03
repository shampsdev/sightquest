import { MAPBOX_TOKEN } from "@/constants";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { JSX } from "react";

Mapbox.setAccessToken(MAPBOX_TOKEN);

interface MapProps {
  children?: JSX.Element | JSX.Element[] | null;
}

export const Map = ({ children }: MapProps) => {
  return (
    <MapView
      scaleBarEnabled={false}
      attributionEnabled={false}
      styleURL="mapbox://styles/mikedegeofroy/cma57ielt004801s3gkciegzd"
      className="flex-1"
    >
      {children}
    </MapView>
  );
};
