import { MAPBOX_STYLE_URL, MAPBOX_TOKEN } from "@/constants";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { logger } from "@/shared/instances/logger.instance";
import { twMerge } from "tailwind-merge";

Mapbox.setAccessToken(MAPBOX_TOKEN);

interface MapProps {
  children?: React.ReactNode;
  className?: string;
}

export const Map = ({ children, className }: MapProps) => {
  const fallbackStyle = "mapbox://styles/mapbox/dark-v11";
  const styleUrl =
    typeof MAPBOX_STYLE_URL === "string" && MAPBOX_STYLE_URL.length > 0
      ? MAPBOX_STYLE_URL
      : fallbackStyle;

  return (
    <MapView
      logoEnabled={false}
      scaleBarEnabled={false}
      attributionEnabled={false}
      styleURL={styleUrl}
      onMapError={(e: any) =>
        logger.error(
          "ui",
          "Mapbox map error",
          e?.nativeEvent?.message ?? e?.message ?? e
        )
      }
      className={twMerge("flex-1", className)}
    >
      {children}
    </MapView>
  );
};
