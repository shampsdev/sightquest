import { GameStatistics } from "@/shared/interfaces/game-statistics";
import { View, Text, Pressable } from "react-native";
import { AvatarStack } from "../ui/avatar-stack";
import { Icons } from "../ui/icons/icons";

interface Pressable {
  onPress?: () => void;
}

export const GameStats = ({
  membersStatistics,
  date,
  route,
  onPress,
}: GameStatistics & Pressable) => {
  const avatars = membersStatistics.map((user) => user.avatar);

  return (
    <Pressable onPress={onPress}>
      <View className="flex w-full flex-row items-center justify-between py-[20px] px-[27.5px]">
        <AvatarStack avatars={avatars} />
        <View className="flex flex-col gap-2">
          <Text className="text-text_primary text-[18px] font-bounded-regular">
            {date.toLocaleDateString("ru-RU")}
          </Text>
          <Text className="text-[#b6b6b6] font-onest-regular text-[16px]">
            Маршрут: {route.title}
          </Text>
        </View>
        <Icons.Eye.Default />
      </View>
    </Pressable>
  );
};
