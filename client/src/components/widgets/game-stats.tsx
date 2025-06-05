import { GameStatistics } from "@/shared/interfaces/GameStats";
import { View, Text, Pressable } from "react-native";
import AvatarStack from "../ui/avatar-stack";
import { Icons } from "../ui/icons/icons";

interface Pressable {
  onPress?: () => void;
}
const GameStats = ({
  members,
  date,
  route,
  onPress,
}: GameStatistics & Pressable) => {
  const avatars = members
    .map((user) => user.avatar)
    .filter((avatar) => avatar !== undefined);

  return (
    <Pressable onPress={onPress}>
      <View className="flex w-full flex-row items-center justify-between py-[20px] px-[27.5px]">
        <AvatarStack avatars={avatars} />
        <View className="flex flex-col gap-2">
          <Text className="text-text_primary text-[18px] font-bounded-regular">
            {date.toLocaleDateString("ru-RU")}
          </Text>
          <Text className="text-[#b6b6b6] font-onest-regular text-[16px]">
            Маршрут: {route}
          </Text>
        </View>
        <Icons.Eye.Default />
      </View>
    </Pressable>
  );
};

export default GameStats;
