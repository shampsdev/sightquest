import { Icons } from "@/components/ui/icons/icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface PauseOverlayProps {
  visible?: boolean;
}

export const PauseOverlay = ({ visible }: PauseOverlayProps) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute w-full h-full flex justify-end items-center"
      pointerEvents={visible ? "auto" : "none"}
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-[#000000ca] flex justify-center items-center z-20">
        <View className="gap-4 flex justify-center items-center">
          <Icons.Pause style={{ height: 40, width: 40 }} />
          <Text className="font-bounded-semibold text-3xl text-text_primary">
            Передышка
          </Text>
          <Text className="text-text_secondary text-2xl text-center">
            Игра пока на паузе, но ты можешь вернуть всех на пробежку!
          </Text>
        </View>
      </View>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={20}
        tint="dark"
        className="absolute w-full h-full z-10"
      />
    </Animated.View>
  );
};
