import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface ProgressBarStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBarSteps = ({
  currentStep,
  totalSteps,
}: ProgressBarStepsProps) => {
  const INDICATOR_WIDTH = 64;
  const GAP = 8;
  const DOT_HEIGHT = 8;

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(currentStep * (48 + GAP), {
      duration: 250,
    });
  }, [currentStep]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="mx-auto mt-4 relative">
      {/* Dots container */}
      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const width = useSharedValue(
            index === currentStep ? INDICATOR_WIDTH : 48
          );

          useEffect(() => {
            width.value = withTiming(
              index === currentStep ? INDICATOR_WIDTH : 48,
              {
                duration: 250,
              }
            );
          }, [currentStep]);

          const animatedStyle = useAnimatedStyle(() => {
            return {
              width: width.value,
            };
          });

          return (
            <Animated.View
              key={`progress_step_${index}`}
              style={animatedStyle}
              className="h-2 rounded-full bg-navigation"
            />
          );
        })}
      </View>

      {/* Floating white indicator above */}
      <Animated.View
        style={[
          {
            position: "absolute",
            height: DOT_HEIGHT,
            width: INDICATOR_WIDTH,
            borderRadius: 999,
            backgroundColor: "#fff",
            top: 0,
            left: 0,
            zIndex: 10,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
};
