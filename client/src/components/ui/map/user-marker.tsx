import Mapbox from "@rnmapbox/maps";
import { BlurView } from "expo-blur";
import { useEffect, useMemo, useRef } from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Avatar } from "../avatar";
import { Coords } from "@/shared/interfaces/coords";
import { useAnimatedCoord } from "@/shared/hooks/useAnimatedCoord";

const AnimatedMarkerView = Animated.createAnimatedComponent(Mapbox.MarkerView);

export const UserMarker = ({
  coordinate,
  name,
  avatarSrc,
  pulse = false,
}: {
  coordinate: Coords;
  name: string;
  avatarSrc: string;
  pulse?: boolean;
}) => {
  const initialCoord = useRef(coordinate);
  const [animatedProps, animate] = useAnimatedCoord([
    initialCoord.current.lon,
    initialCoord.current.lat,
  ]);
  const prevCoord = useRef(coordinate);

  useEffect(() => {
    if (
      coordinate &&
      (prevCoord.current.lat !== coordinate.lat ||
        prevCoord.current.lon !== coordinate.lon)
    ) {
      animate({
        latitude: coordinate.lat,
        longitude: coordinate.lon,
      });
      prevCoord.current = coordinate;
    }
  }, [coordinate.lat, coordinate.lon]);

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (pulse) {
      const duration = 800;

      pulseScale.value = withRepeat(
        withTiming(1.2, {
          duration,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        true
      );

      pulseOpacity.value = withRepeat(withTiming(0, { duration }), -1, true);
    }
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <AnimatedMarkerView
      coordinate={[initialCoord.current.lon, initialCoord.current.lat]}
      anchor={{ x: 0.5, y: 0.5 }}
      animatedProps={animatedProps}
      allowOverlap={false}
      allowOverlapWithPuck={false}
      isSelected={false}
    >
      <View className="items-center">
        <View className="rounded-full overflow-hidden z-10">
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={10}
            tint="dark"
            className="px-2 py-1"
          >
            <Text className="font-onest-medium text-xs">{name}</Text>
          </BlurView>
        </View>

        <View className="items-center -mt-2">
          {pulse && (
            <Animated.View
              className="absolute h-14 w-14 rounded-full bg-accent_primary"
              style={pulseStyle}
            />
          )}

          <Avatar
            source={{ uri: avatarSrc }}
            className={
              pulse
                ? "border-2 border-accent_primary"
                : "border-2 border-text_primary"
            }
          />
          <Image
            className="absolute h-20 w-20 opacity-50"
            source={require("@/assets/shadow.png")}
            resizeMode="cover"
          />
        </View>
      </View>
    </AnimatedMarkerView>
  );
};
