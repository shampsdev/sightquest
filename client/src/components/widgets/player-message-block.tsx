import { ImageSourcePropType, View } from "react-native";
import { Avatar } from "../ui/avatar";
import { PlayerMessage } from "./player-message";
import { twMerge } from "tailwind-merge";

interface PlayerMessageBlockProps {
  nickname?: string;
  avatar: ImageSourcePropType;
  messages: string[];
  alignRight?: boolean;
}

export const PlayerMessageBlock = ({
  nickname,
  avatar,
  messages,
  alignRight,
}: PlayerMessageBlockProps) => {
  return (
    <View
      className={twMerge(
        "flex flex-row gap-[10px]",
        alignRight ? "flex-row-reverse align-end" : ""
      )}
    >
      <Avatar source={avatar} className="w-[38px] h-[38px]" />
      <View className="flex flex-col gap-[10px]">
        {messages.map((message, index) => (
          <PlayerMessage
            nickname={index === 0 ? nickname : undefined}
            message={message}
            key={index + message}
            alignRight={alignRight}
          />
        ))}
      </View>
    </View>
  );
};
