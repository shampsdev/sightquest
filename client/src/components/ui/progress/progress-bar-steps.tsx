import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

interface ProgressBarConfig {
  indicatorWidth?: number;
  indicatorWidthSm?: number;
  gap?: number;
  dotHeight?: number;
  duration?: number;
}

interface ProgressBarStepsProps {
  currentStep: number;
  totalSteps: number;
  config?: ProgressBarConfig;
}

export const ProgressBarSteps = ({
  currentStep,
  totalSteps,
  config = {},
}: ProgressBarStepsProps) => {
  const {
    indicatorWidth = 64,
    indicatorWidthSm = 48,
    gap = 8,
    dotHeight = 8,
    duration = 250,
  } = config;

  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(currentStep * (indicatorWidthSm + gap), {
      duration,
    });
  }, [currentStep]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="mx-auto mt-4 relative">
      <View className="flex-row" style={{ gap }}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const width = useSharedValue(
            index === currentStep ? indicatorWidth : indicatorWidthSm
          );

          useEffect(() => {
            width.value = withTiming(
              index === currentStep ? indicatorWidth : indicatorWidthSm,
              { duration }
            );
          }, [currentStep]);

          const animatedStyle = useAnimatedStyle(() => ({
            width: width.value,
          }));

          return (
            <Animated.View
              key={`progress_step_${index}`}
              style={[
                animatedStyle,
                {
                  height: dotHeight,
                  borderRadius: 999,
                },
              ]}
              className="bg-navigation"
            />
          );
        })}
      </View>

      <Animated.View
        style={[
          {
            position: "absolute",
            height: dotHeight,
            width: indicatorWidth,
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
