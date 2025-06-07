import { Animated, View, Text, Image, ImageSourcePropType } from "react-native";
import { PlayerMarker } from "./map/player-marker";
import { BlurView } from "expo-blur";
import { Avatar } from "./avatar";
import { Nickname } from "./nickname";
import { NicknameType } from "@/shared/interfaces/nickname";
import { twMerge } from "tailwind-merge";

interface PlayerPreviewProps {
  name: string;
  nicknameType: NicknameType;
  avatar: ImageSourcePropType;
  className?: string;
}

export const PlayerPreview = ({
  name,
  nicknameType,
  avatar,
  className,
}: PlayerPreviewProps) => {
  return (
    <View className={twMerge("items-center", className)}>
      <Nickname name="aboba" type={"default"} />
      <View className="items-center -mt-2">
        <Avatar source={avatar} className="border-2 border-text_primary z-10" />

        <Image
          className="absolute h-20 w-20 opacity-50"
          source={require("@/assets/shadow.png")}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};
