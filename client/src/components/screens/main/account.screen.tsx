import { Avatar } from "@/components/ui/avatar";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { GameStats } from "@/components/widgets/game-stats";
import { UserProfile } from "@/components/widgets/user/user-profile";
import { UserStats } from "@/components/widgets/user/user-stats";
import { AVATARS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { useGames } from "@/shared/api/hooks/useGames";
import { useStyles } from "@/shared/api/hooks/useStyles";
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

  const { data: games } = useGames(3);

  const { data: avatars } = useStyles({ type: "avatar" });

  const back = () => {
    navigation.goBack();
  };

  const goToEdit = () => {
    navigation.navigate("EditProfile");
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
            <Pressable onPress={goToEdit}>
              <IconContainer className="bg-[#222222]">
                <Icons.Edit />
              </IconContainer>
            </Pressable>
          </View>

          <UserProfile
            avatar={{
              uri: avatars?.find((x) => x.id === user?.styles?.avatarId)?.style
                .url,
            }}
            name={user?.name || ""}
            username={user?.username || ""}
          />

          <UserStats wins={0} matches={0} />

          <View>
            {games &&
              games.length > 0 &&
              games?.map((game) => (
                <GameStats
                  key={game.id}
                  membersStatistics={game.players.map((player) => {
                    return {
                      score: player.score,
                      username: player.user.username,
                      avatar: {
                        uri: avatars?.find(
                          (x) => x.id === player.user.styles?.avatarId
                        )?.style.url,
                      },
                    };
                  })}
                  route={"A"}
                  date={new Date(game.createdAt)}
                  onPress={() => {
                    navigation.navigate("History", { gameId: game.id });
                  }}
                />
              ))}
            <Pressable className="mx-auto pt-4" onPress={logout}>
              <Text className="text-lg text-text_secondary font-onest-medium">
                Выйти
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
