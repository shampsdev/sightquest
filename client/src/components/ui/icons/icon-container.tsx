import { BlurView } from "expo-blur";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface IconContainerProps extends ViewProps {
  active?: boolean;
}

export const IconContainer = ({
  children: icon,
  className,
  active = false,
}: IconContainerProps) => {
  return (
    <View>
      {active && (
        <View className="h-5 w-5 border-[#fff] border-2 bg-accent_primary absolute z-20 -top-1 -right-1 rounded-full" />
      )}
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
    </View>
  );
};
