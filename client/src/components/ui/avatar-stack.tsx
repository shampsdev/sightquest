import { ImageSourcePropType, Text, View } from "react-native";
import { Avatar } from "./avatar";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface AvatarStackProps {
  avatars: ImageSourcePropType[];
  className?: string;
  avatarWidth?: number;
}

export const AvatarStack = ({
  avatars,
  className,
  avatarWidth,
}: AvatarStackProps) => {
  const AVATAR_WIDTH = avatarWidth ? avatarWidth : 40;
  const positionClasses = ["left-0 z-1", "left-10 z-10", "left-20 z-20"];
  const DISPLAY_AVATARS = 3;
  const hiddenAvatarsCount = avatars?.length - DISPLAY_AVATARS;
  const showedAvatarsCount =
    avatars?.length >= DISPLAY_AVATARS ? DISPLAY_AVATARS : avatars?.length;

  const width = showedAvatarsCount * AVATAR_WIDTH;
  avatars?.length > 2
    ? AVATAR_WIDTH * showedAvatarsCount
    : 15 * showedAvatarsCount;

  console.log(avatarWidth, avatars);
  return (
    <View
      className="flex flex-row h-[48px] items-center relative"
      style={{ width: width }}
    >
      {avatars?.slice(0, DISPLAY_AVATARS).map((avatar, index) => (
        <Avatar
          className={twMerge(
            `absolute ${positionClasses[index]} w-[${AVATAR_WIDTH}px]`,
            className
          )}
          key={index}
          source={avatar}
        />
      ))}
      {hiddenAvatarsCount > 0 && (
        <View className="absolute top-[-6px] right-[-10px] rounded-full bg-accent_primary z-40 px-[8px] py-[4px]">
          <Text className="font-bounded-regular text-text_primary text-[12px]">
            +{hiddenAvatarsCount}
          </Text>
        </View>
      )}
    </View>
  );
};
