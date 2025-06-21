import { ImageSourcePropType, Text, View } from "react-native";
import { Avatar } from "./avatar";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface AvatarStackProps {
  avatars: ImageSourcePropType[];
  className?: string;
  avatarWidth?: number;
}

export const AvatarStackSmall = ({
  avatars,
  className,
  avatarWidth,
}: AvatarStackProps) => {
  const AVATAR_WIDTH = avatarWidth ? avatarWidth : 20;
  const positionClasses = ["left-0 z-1", "left-5 z-10", "left-20 z-20"];
  const DISPLAY_AVATARS = 2;
  const showedAvatarsCount =
    avatars?.length >= DISPLAY_AVATARS ? DISPLAY_AVATARS : avatars?.length;

  const width = showedAvatarsCount * AVATAR_WIDTH;

  return (
    <View
      className="flex flex-row h-[48px] items-center relative"
      style={{ width: width }}
    >
      {avatars?.slice(0, DISPLAY_AVATARS).map((avatar, index) => (
        <Avatar
          className={twMerge(`absolute ${positionClasses[index]}`, className)}
          style={{ width: AVATAR_WIDTH, height: AVATAR_WIDTH }}
          key={index}
          source={avatar}
        />
      ))}
    </View>
  );
};

export const AvatarStack = ({ avatars }: AvatarStackProps) => {
  const positionClasses = ["left-0 z-1", "left-10 z-10", "left-20 z-20"];
  const DISPLAY_AVATARS = 3;
  const showedAvatarsCount =
    avatars.length >= DISPLAY_AVATARS ? DISPLAY_AVATARS : avatars.length;

  const width = DISPLAY_AVATARS * 40;
  avatars.length > 2 ? 40 * showedAvatarsCount : 15 * showedAvatarsCount;

  return (
    <View className="flex flex-row h-[48px] relative" style={{ width: width }}>
      {avatars.slice(0, DISPLAY_AVATARS).map((avatar, index) => (
        <Avatar
          className={`absolute ${positionClasses[index]}`}
          key={index}
          source={avatar}
        />
      ))}
    </View>
  );
};
