import { Avatar } from "@/components/ui/avatar";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { GameStats } from "@/components/widgets/game-stats";
import { UserProfile } from "@/components/widgets/user/user-profile";
import { UserStats } from "@/components/widgets/user/user-stats";
import { AVATARS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { GameStatistics } from "@/shared/interfaces/game-statistics";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, View, Image, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AccountScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { user, logout } = useAuthStore();

  const mockGamesStatistics: GameStatistics[] = [
    {
      membersStatistics: [
        {
          score: 0,
          username: "userMock1",
          avatar: AVATARS[0].src,
        },
        {
          score: 0,
          username: "userMock2",
          avatar: AVATARS[1].src,
        },
        {
          score: 0,
          username: "userMock4",
          avatar: AVATARS[2].src,
        },
        {
          score: 0,
          username: "userMock3",
          avatar: AVATARS[3].src,
        },
      ],
      route: "A",
      date: new Date(),
    },
    {
      membersStatistics: [
        {
          score: 0,
          username: "userMock1",
          avatar: AVATARS[0].src,
        },
        {
          score: 0,
          username: "userMock2",
          avatar: AVATARS[1].src,
        },
        {
          score: 0,
          username: "userMock4",
          avatar: AVATARS[2].src,
        },
        {
          score: 0,
          username: "userMock3",
          avatar: AVATARS[3].src,
        },
      ],
      route: "A",
      date: new Date(),
    },
    {
      membersStatistics: [
        {
          score: 0,
          username: "userMock1",
          avatar: AVATARS[0].src,
        },
        {
          score: 0,
          username: "userMock2",
          avatar: AVATARS[1].src,
        },
        {
          score: 0,
          username: "userMock4",
          avatar: AVATARS[2].src,
        },
      ],
      route: "A",
      date: new Date(),
    },
    {
      membersStatistics: [
        {
          score: 0,
          username: "userMock1",
          avatar: AVATARS[0].src,
        },
        {
          score: 0,
          username: "userMock2",
          avatar: AVATARS[1].src,
        },
      ],
      route: "A",
      date: new Date(),
    },

    {
      membersStatistics: [
        {
          score: 0,
          username: "userMock1",
          avatar: AVATARS[0].src,
        },
        {
          score: 0,
          username: "userMock2",
          avatar: AVATARS[1].src,
        },
      ],
      route: "A",
      date: new Date(),
    },
    {
      membersStatistics: [
        {
          score: 0,
          username: "userMock1",
          avatar: AVATARS[0].src,
        },
      ],
      route: "A",
      date: new Date(),
    },
  ];

  const back = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-bg_primary">
      <ScrollView className="w-full">
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

          <UserProfile
            avatar={
              user?.avatar
                ? AVATARS.find((x) => x.id === Number(user.avatar))?.src
                : AVATARS[0].src
            }
            name={user?.name || ""}
            username={user?.username || ""}
          />

          <UserStats wins={0} matches={0} />

          <View>
            {mockGamesStatistics.map((stats, index) => (
              <GameStats
                key={index}
                membersStatistics={stats.membersStatistics}
                route={stats.route}
                date={stats.date}
                onPress={() => {
                  navigation.navigate("History", { gameId: "mockId" });
                }}
              />
            ))}
            <Pressable className="mx-auto pt-4" onPress={logout}>
              <Text className="text-lg text-text_secondary font-onest-medium">Выйти</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
