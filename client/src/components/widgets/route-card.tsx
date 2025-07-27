// route-card.tsx - Correct export
import { MAPBOX_STYLE_URL } from "@/constants";
import { Route } from "@/shared/interfaces/route";
import { Camera, MapView } from "@rnmapbox/maps";
import { CameraRef } from "@rnmapbox/maps/lib/typescript/src/components/Camera";
import { BlurView } from "expo-blur";
import { memo, useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RouteMarker } from "../ui/map/route-marker";
import { PlaceMarker } from "../ui/map/place-marker";

export interface RouteCardProps {
  route: Route;
  title: string;
  buttonAction?: () => void;
  disabled?: boolean;
}

export const RouteCardComponent = ({
  route,
  title,
  buttonAction,
  disabled,
}: RouteCardProps) => {
  const routeCoordinatesRef = useRef<[number, number][] | null>(null);
  const cameraRef = useRef<CameraRef>(null);
  const hasFittedRef = useRef(false);

  const toLonLat = (r: Route): [number, number][] =>
    r.taskPoints.map((tp) => [tp.location.lon, tp.location.lat]);

  if (routeCoordinatesRef.current === null) {
    routeCoordinatesRef.current = toLonLat(route);
  }

  const fitRouteToMap = useCallback(() => {
    if (
      hasFittedRef.current ||
      !cameraRef.current ||
      !routeCoordinatesRef.current
    )
      return;

    const coords = routeCoordinatesRef.current;
    if (coords.length === 0) return;

    try {
      if (coords.length === 1) {
        cameraRef.current.moveTo(coords[0], 0);
      } else {
        const lats = coords.map(([, lat]) => lat);
        const lons = coords.map(([lon]) => lon);
        const southWest: [number, number] = [
          Math.min(...lons),
          Math.min(...lats),
        ];
        const northEast: [number, number] = [
          Math.max(...lons),
          Math.max(...lats),
        ];
        cameraRef.current.fitBounds(northEast, southWest, 40, 0);
      }
      hasFittedRef.current = true;
    } catch (error) {
      console.warn("Failed to fit route to map:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fitRouteToMap();
    }, 100);

    return () => clearTimeout(timer);
  }, [fitRouteToMap]);

  return (
    <View className="min-w-full relative max-h-[280px]">
      <MapView
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        compassEnabled={false}
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        styleURL={MAPBOX_STYLE_URL}
        className="flex-1 h-full rounded-[30px] overflow-hidden"
        onDidFinishLoadingMap={fitRouteToMap}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: routeCoordinatesRef.current?.[0] || [0, 0],
            zoomLevel: 12,
          }}
        />
        <RouteMarker
          key={`route_marker_${route.id}`}
          shapes={route.taskPoints.map((point) => (
            <PlaceMarker
              key={point.id}
              coordinate={[point.location.lon, point.location.lat]}
            />
          ))}
          path={route.taskPoints}
          routeId={route.id}
        />
      </MapView>

      <View className="w-full absolute flex flex-row items-center bottom-[8px] mx-auto justify-center">
        <View className="w-[95%] flex flex-row px-[20px] py-[8px] items-center justify-between overflow-hidden rounded-[40px]">
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              borderRadius: 40,
            }}
            tint="dark"
            intensity={10}
          />
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(34, 34, 34, 0.8)",
              borderRadius: 40,
            }}
          />
          <Text className="font-bounded-regular text-[12px] text-text_primary z-10">
            {title}
          </Text>
          <View className="z-10">
            <Pressable
              style={{
                backgroundColor: disabled
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(151, 93, 255, 1)",
              }}
              className="flex w-fit rounded-[40px] px-[20px] py-[9px]"
              disabled={disabled}
              onPress={buttonAction}
            >
              <Text className="text-[14px] font-bounded-regular text-text_primary">
                Купить
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export const RouteCard = memo(RouteCardComponent);
RouteCard.displayName = "RouteCard";
