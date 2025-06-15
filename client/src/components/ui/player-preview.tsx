import { NicknameType } from "@/shared/interfaces/nickname";
import { Image, ImageSourcePropType, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Avatar } from "./avatar";
import { Nickname } from "./nickname";

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
      <Nickname name={name} type={nicknameType} />
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
