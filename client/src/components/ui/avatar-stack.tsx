import { ImageSourcePropType, Text, View } from "react-native";
import { Avatar } from "./avatar";

interface AvatarStackProps {
  avatars: ImageSourcePropType[];
}

export const AvatarStack = ({ avatars }: AvatarStackProps) => {
  const positionClasses = ["left-0 z-1", "left-10 z-10", "left-20 z-20"];
  const DISPLAY_AVATARS = 3;
  const hiddenAvatarsCount = avatars.length - DISPLAY_AVATARS;
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
