import { View, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  mainText: string;
  descriptionText: string;
  className?: string;
}

export const Header = ({
  mainText,
  descriptionText,
  className,
}: HeaderProps) => {
  return (
    <View
      className={twMerge(
        "flex flex-col gap-5 items-center justify-center",
        className
      )}
    >
      <Text className="mx-auto text-text_primary pt-2 text-[24px] font-bounded-medium">
        {mainText}
      </Text>

      <Text className="mx-auto text-[14px] text-text_secondary font-bounded-regular">
        {descriptionText}
      </Text>
    </View>
  );
};
