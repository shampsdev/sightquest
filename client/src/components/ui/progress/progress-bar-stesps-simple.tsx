import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface ProgressBarConfig {
  activeWidth?: number;
  inactiveWidth?: number;
  gap?: number;
  dotHeight?: number;
  duration?: number;
  activeColorClass?: string;
  inactiveColorClass?: string;
}

interface ProgressBarStepsProps {
  currentStep: number;
  totalSteps: number;
  config?: ProgressBarConfig;
}

export const ProgressBarStepsSimple = ({
  currentStep,
  totalSteps,
  config = {},
}: ProgressBarStepsProps) => {
  const {
    activeWidth = 64,
    inactiveWidth = 48,
    gap = 8,
    dotHeight = 8,
    duration = 250,
    activeColorClass = "bg-text_primary",
    inactiveColorClass = "bg-navigation",
  } = config;

  return (
    <View className="flex-row justify-center mt-4" style={{ columnGap: gap }}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const width = useSharedValue(
          index === currentStep ? activeWidth : inactiveWidth
        );

        useEffect(() => {
          width.value = withTiming(
            index === currentStep ? activeWidth : inactiveWidth,
            { duration }
          );
        }, [currentStep]);

        const animatedStyle = useAnimatedStyle(() => ({
          width: width.value,
          height: dotHeight,
        }));

        return (
          <Animated.View
            key={`progress_step_${index}`}
            style={animatedStyle}
            className={twMerge(
              "rounded-full",
              index === currentStep ? activeColorClass : inactiveColorClass
            )}
          />
        );
      })}
    </View>
  );
};
