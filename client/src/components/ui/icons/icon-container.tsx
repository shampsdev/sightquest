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
        "flex-1 items-center justify-center h-12 w-12 rounded-full bg-[#67676780]",
        className
      )}
    >
      {icon}
    </View>
  );
};
