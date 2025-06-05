import { Avatar } from "@/components/ui/avatar";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import GameStats from "@/components/widgets/game-stats";
import { ACTIVITIES, AVATARS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { User } from "@/shared/interfaces/User";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Pressable,
  View,
  Image,
  Text,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AccountScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { logout, user } = useAuthStore();
  const back = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 justify-end bg-bg_primary">
      <View className="absolute top-20 w-full">
        <View className="w-[90%] gap-[60px] relative mx-auto flex-col items-center">
          <View className="absolute w-full flex-row justify-between items-center">
            <Pressable onPress={back}>
              <IconContainer className="bg-[#222222]">
                <Icons.Back />
              </IconContainer>
            </Pressable>
            <Pressable onPress={back}>
              <IconContainer className="bg-[#222222]">
                <Icons.Edit />
              </IconContainer>
            </Pressable>
          </View>

          <View className="flex flex-col gap-6 items-center justify-center">
            <Avatar
              source={
                user?.avatar
                  ? AVATARS.find((x) => x.id === Number(user.avatar))?.src
                  : AVATARS[0].src
              }
              className="w-[154px] h-[154px]"
            />
            <View className="flex flex-col gap-2 items-center">
              <Text className="font-bounded-regular text-text_primary text-[24px]">
                {user?.name}
              </Text>
              <Text className="text-text_secondary font-onest-regular text-[16px]">
                {"@" + user?.username}
              </Text>
            </View>
          </View>

          <View className="w-full flex flex-row gap-[4px] items-center justify-between">
            <View className="flex-1 py-[16px] justify-center flex-row items-center bg-navigation rounded-tl-[30px] rounded-bl-[30px]">
              <View className="flex flex-row gap-4 items-center">
                <Image
                  className="h-14 w-14 rounded-full my-auto"
                  source={ACTIVITIES.wins}
                />
                <View className="flex flex-col gap-1 justify-center items-start">
                  <Text className="font-bounded-regular text-[24px] text-text_primary">
                    {user?.stats?.wins || 0}
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
                    {user?.stats?.matches || 0}
                  </Text>
                  <Text className="font-onest-regular text-[16px] text-[#b6b6b6]">
                    матчей
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View>
            <GameStats route={"A"} date={new Date()} members={} />
          </View>
        </View>
      </View>

      <Text
        className="text-center text-md font-medium text-text_secondary"
        onPress={logout}
      >
        Выйти
      </Text>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
