import { useCallback } from "react";
import {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

  const animate = useCallback(
    (next: { longitude?: number; latitude?: number; duration?: number }) => {
      const { duration = 500 } = next;

      if (typeof next.latitude === "number") {
        latitude.value = withTiming(next.latitude, { duration });
      }
      if (typeof next.longitude === "number") {
        longitude.value = withTiming(next.longitude, { duration });
      }
    },
    []
  );

  return [animatedProps, animate] as const;
};
