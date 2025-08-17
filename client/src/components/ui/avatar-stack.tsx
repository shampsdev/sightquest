import { Text, View } from "react-native";
import { Avatar } from "./avatar";
import { twMerge } from "tailwind-merge";
import { hasAvatar, User } from "@/shared/interfaces/user";
import { useStyles } from "@/shared/api/hooks/useStyles";

interface AvatarStackProps {
  users: User[];
  className?: string;
  avatarWidth?: number;
}

export const AvatarStackSmall = ({
  users,
  className,
  avatarWidth,
}: AvatarStackProps) => {
  const safeUsers = Array.isArray(users) ? users.filter(Boolean) : [];
  const { getStyle } = useStyles({ type: "avatar" });

  const AVATAR_WIDTH = avatarWidth ? avatarWidth : 20;
  const positionClasses = ["left-0 z-1", "left-5 z-10", "left-20 z-20"];
  const DISPLAY_AVATARS = 2;
  const showedAvatarsCount =
    safeUsers.length >= DISPLAY_AVATARS ? DISPLAY_AVATARS : safeUsers.length;

  const width = showedAvatarsCount * AVATAR_WIDTH;

  return (
    <View
      className="flex flex-row h-[48px] items-center relative"
      style={{ width: width }}
    >
      {safeUsers.slice(0, DISPLAY_AVATARS).map((user, index) => (
        <Avatar
          className={twMerge(`absolute ${positionClasses[index]}`, className)}
          style={{ width: AVATAR_WIDTH, height: AVATAR_WIDTH }}
          key={index}
          source={{
            uri: hasAvatar(user) && getStyle(user.styles.avatarId)?.style.url,
          }}
        />
      ))}
    </View>
  );
};

export const AvatarStack = ({ users }: AvatarStackProps) => {
  const safeUsers = Array.isArray(users) ? users.filter(Boolean) : [];
  const { getStyle } = useStyles({ type: "avatar" });

  const positionClasses = ["left-0 z-1", "left-10 z-10", "left-20 z-20"];
  const DISPLAY_AVATARS = 3;
  const showedAvatarsCount =
    safeUsers.length >= DISPLAY_AVATARS ? DISPLAY_AVATARS : safeUsers.length;

  const width = DISPLAY_AVATARS * 40;
  users.length > 2 ? 40 * showedAvatarsCount : 15 * showedAvatarsCount;

  return (
    <View className="flex flex-row h-[48px] relative" style={{ width: width }}>
      {safeUsers.slice(0, DISPLAY_AVATARS).map((user, index) => (
        <Avatar
          className={`absolute ${positionClasses[index]}`}
          key={index}
          source={{
            uri: hasAvatar(user) && getStyle(user.styles.avatarId)?.style.url,
          }}
        />
      ))}
    </View>
  );
};
