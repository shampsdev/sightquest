import { useCallback, useRef } from "react";
import {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
};

export const useAnimatedCoord = (coordinate: [number, number]) => {
  const [long, lat] = coordinate;
  const longitude = useSharedValue(long);
  const latitude = useSharedValue(lat);

  const animatedProps = useAnimatedProps(
    () => ({
      coordinate: [longitude.value ?? 0, latitude.value ?? 0],
    }),
    [long, lat]
  );

  const lastUpdate = useRef({
    time: Date.now(),
    longitude: long,
    latitude: lat,
  });

  const animate = useCallback(
    (next: { longitude?: number; latitude?: number }) => {
      const now = Date.now();
      const timeDiff = now - lastUpdate.current.time;

      const distance = calculateDistance(
        latitude.value,
        longitude.value,
        next.latitude ?? latitude.value,
        next.longitude ?? longitude.value
      );

      const duration = Math.max(timeDiff, 3000);

      lastUpdate.current = {
        time: now,
        longitude: next.longitude ?? 0,
        latitude: next.latitude ?? 0,
      };

      if (typeof next.latitude === "number") {
        latitude.value = withTiming(next.latitude, {
          duration,
          easing: Easing.linear,
        });
      }
      if (typeof next.longitude === "number") {
        longitude.value = withTiming(next.longitude, {
          duration,
          easing: Easing.linear,
        });
      }
    },
    []
  );

  return [animatedProps, animate] as const;
};
