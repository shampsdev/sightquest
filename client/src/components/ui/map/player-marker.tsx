import { useAnimatedCoord } from "@/shared/hooks/useAnimatedCoord";
import Mapbox from "@rnmapbox/maps";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { View, Text, Image } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Avatar } from "../avatar";
import { Coords } from "@/shared/interfaces/coords";

const AnimatedMarkerView = Animated.createAnimatedComponent(Mapbox.MarkerView);

export const PlayerMarker = ({
  coordinate,
  name,
  avatarSrc,
  pulse = false,
}: {
  coordinate: Coords;
  name: string;
  avatarSrc: any;
  pulse?: boolean;
}) => {
  const [animatedProps, animate] = useAnimatedCoord([
    coordinate.lon,
    coordinate.lat,
  ]);

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

  useEffect(() => {
    if (coordinate) {
      animate({
        latitude: coordinate.lat,
        longitude: coordinate.lon,
        duration: 500,
      });
    }
  }, [coordinate]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <AnimatedMarkerView
      coordinate={[coordinate.lon, coordinate.lat]}
      anchor={{ x: 0.5, y: 0.5 }}
      animatedProps={animatedProps}
      allowOverlap={false}
      allowOverlapWithPuck={false}
      isSelected={false}
    >
      <View className="items-center">
        <View className="rounded-full overflow-hidden z-10">
          <BlurView intensity={10} tint="dark" className="px-2 py-1">
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
            source={avatarSrc}
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
