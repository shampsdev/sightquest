import { View, Text, Dimensions } from "react-native";

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
      style={{
        alignSelf: alignRight ? "flex-end" : "flex-start",
        maxWidth: Math.round(Dimensions.get("window").width * 0.78),
      }}
    >
      {nickname && (
        <Text className="text-[#B6B6B6] font-inter-regular text-[12px]">
          {nickname}
        </Text>
      )}
      <Text
        className="text-text_primary text-[16px] font-inter-regular"
        style={{ flexShrink: 1 }}
        numberOfLines={0}
        ellipsizeMode="tail"
      >
        {message}
      </Text>
    </View>
  );
};
