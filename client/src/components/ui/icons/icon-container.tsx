import { BlurView } from "expo-blur";
import { JSX } from "react";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface IconContainerProps extends ViewProps {}

export const IconContainer = ({
  children: icon,
  className,
}: IconContainerProps) => {
  return (
    <View
      className={twMerge(
        "h-12 w-12 rounded-full overflow-hidden bg-[#67676780]",
        className
      )}
    >
      <BlurView
        className="h-full w-full items-center justify-center"
        intensity={10}
      >
        {icon}
      </BlurView>
    </View>
  );
};
