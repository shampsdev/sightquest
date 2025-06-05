import { ACTIVITIES } from "@/constants";
import { View, Image, Text } from "react-native";

interface UserStatsProps {
  wins: number;
  matches: number;
}

const UserStats = ({ wins, matches }: UserStatsProps) => {
  return (
    <View className="w-full flex flex-row gap-[4px] items-center justify-between">
      <View className="flex-1 py-[16px] justify-center flex-row items-center bg-navigation rounded-tl-[30px] rounded-bl-[30px]">
        <View className="flex flex-row gap-4 items-center">
          <Image
            className="h-14 w-14 rounded-full my-auto"
            source={ACTIVITIES.wins}
          />
          <View className="flex flex-col gap-1 justify-center items-start">
            <Text className="font-bounded-regular text-[24px] text-text_primary">
              {wins}
            </Text>
            <Text className="font-onest-regular text-[16px] text-[#b6b6b6]">
              побед
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-1 py-[16px] justify-center items-center bg-navigation rounded-tr-[30px] rounded-br-[30px]">
        <View className="flex flex-row gap-4 items-center">
          <Image
            className="h-14 w-14 rounded-full my-auto"
            source={ACTIVITIES.matches}
          />
          <View className="flex flex-col gap-1 justify-center items-start">
            <Text className="font-bounded-regular text-[24px] text-text_primary">
              {matches}
            </Text>
            <Text className="font-onest-regular text-[16px] text-[#b6b6b6]">
              матчей
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserStats;
