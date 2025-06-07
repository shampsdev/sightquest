import { View, Text } from "react-native";

interface HeaderProps {
  mainText: string;
  descriptionText: string;
}

export const Header = ({ mainText, descriptionText }: HeaderProps) => {
  return (
    <View className="flex flex-col items-center justify-center">
      <Text className="mx-auto text-text_primary text-[24px] font-bounded-regular">
        {mainText}
      </Text>

      <Text className="mx-auto text-[16px] text-text_secondary font-bounded-regular">
        {descriptionText}
      </Text>
    </View>
  );
};
