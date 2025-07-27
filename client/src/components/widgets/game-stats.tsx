import { GameStatistics } from "@/shared/interfaces/stats/game-statistics";
import { View, Text, Pressable } from "react-native";
import { AvatarStack } from "../ui/avatar-stack";
import { Icons } from "../ui/icons/icons";

interface Pressable {
  onPress?: () => void;
}

export const GameStats = ({
  players,
  date,
  route,
  onPress,
}: GameStatistics & Pressable) => {
  const users = players.map((player) => player.user);

  return (
    <Pressable onPress={onPress}>
      <View className="flex w-full flex-row items-center justify-between py-[20px] px-[27.5px]">
        <AvatarStack users={users} />
        <View className="flex flex-col gap-2">
          <Text className="text-text_primary text-[18px] font-bounded-regular">
            {date.toLocaleDateString("ru-RU")}
          </Text>
          {route && (
            <Text className="text-[#b6b6b6] font-onest-regular text-[16px]">
              Маршрут: {route.title}
            </Text>
          )}
        </View>
        <Icons.Eye.Default />
      </View>
    </Pressable>
  );
};
