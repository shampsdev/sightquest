import { Header } from "@/components/ui/header";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { UserPreview } from "@/components/widgets/user/user-preview";
import { MainStackParamList } from "@/routers/main.navigator";
import { useGame } from "@/shared/api/hooks/useGame";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { hasAvatar } from "@/shared/interfaces/user";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HistoryRouteProp = RouteProp<MainStackParamList, "History">;

export const HistoryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<HistoryRouteProp>();
  const insets = useSafeAreaInsets();
  const { gameId } = route.params;

  const { data: game } = useGame(gameId);
  const { getStyle } = useStyles({ type: "avatar" });

  const back = () => {
    navigation.goBack();
  };

  return (
    game && (
      <SafeAreaView
        className="flex-1 bg-bg_primary"
        style={{ paddingTop: insets.top || 20 }}
      >
        <ScrollView className="w-full">
          <View className="w-[90%] gap-[36px] relative mx-auto flex-col items-center">
            <View className="absolute w-full flex-row justify-between items-center">
              <Pressable onPress={back}>
                <IconContainer className="bg-[#222222]">
                  <Icons.Back />
                </IconContainer>
              </Pressable>
            </View>

            <Header mainText={"Участники"} descriptionText={"Маршрут: A"} />

            <View className="flex flex-col w-full gap-[15px]">
              {game.players.map((player) => (
                <UserPreview
                  key={`history_player_${player.user.id}`}
                  avatar={{
                    uri:
                      hasAvatar(player.user) &&
                      getStyle(player.user.styles.avatarId)?.style.url,
                  }}
                  name={player.user.name}
                  role={player.role}
                  scores={player.score}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  );
};
