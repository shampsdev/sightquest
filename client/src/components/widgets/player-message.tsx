import { ImageSourcePropType, View, Text } from "react-native";

interface PlayerMessageProps {
  message: string;
  nickname?: string;
  alignRight?: boolean;
}

export const PlayerMessage = ({
  message,
  nickname,
  alignRight,
}: PlayerMessageProps) => {
  return (
    <View
      className="bg-[#676767] rounded-[16px] px-[12px] py-[8px]"
      style={{ alignSelf: alignRight ? "flex-end" : "flex-start" }}
    >
      {nickname && (
        <Text className="text-[#B6B6B6] font-inter-regular text-[12px]">
          {nickname}
        </Text>
      )}
      <Text className="text-text_primary text-[16px] font-inter-regular max-w-[90%]">
        {message}
      </Text>
    </View>
  );
};
