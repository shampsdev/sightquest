import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { UserLobbyPreview } from "@/components/widgets/user/user-preview.lobby";
import { GameStackParamList } from "@/routers/game.navigator";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGameStore } from "@/shared/stores/game.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavProp = StackNavigationProp<GameStackParamList, "Lobby">;

export const LobbyScreen = () => {
  const { emit } = useSocket();
  const navigation = useNavigation<NavProp>();
  const { game } = useGameStore();
  const { user } = useAuthStore();
  const { data: avatars } = useStyles({ type: "avatar" });

  const start = () => {
    if (game && game?.state === "game") {
      navigation.navigate("Game");
    } else {
      emit("startGame");
    }
  };

  const back = () => {
    navigation.goBack();
  };

  const routes = () => {
    navigation.navigate("Route");
  };

  useEffect(() => {
    if (game && game?.state === "game") {
      navigation.navigate("Game");
    }
  }, [game?.state]);

  useEffect(() => console.log(game?.players), [game]);

  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-bg_primary" style={{ paddingTop: insets.top }}>
      <View className="flex-1 w-full">
        <ScrollView
          className="w-full flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="w-[90%] gap-[36px] relative mx-auto flex-col items-center">
            <View className="absolute w-full flex-row justify-between items-center">
              <Pressable onPress={back}>
                <IconContainer className="bg-[#222222]">
                  <Icons.Back />
                </IconContainer>
              </Pressable>
            </View>

            <Header
              mainText={"Участники"}
              descriptionText={"Поделитесь кодом с друзьями"}
            />

            <View className="flex rounded-[20px] h-[64px] flex-row gap-5 bg-navigation w-full items-center justify-center">
              <Text className="font-bounded-semibold text-text_primary text-[24px]">
                {game?.id}
              </Text>
              <Icons.Copy />
            </View>

            <View className="flex flex-col w-full gap-[15px]">
              {game?.players &&
                game.players.map((player, index) => (
                  <UserLobbyPreview
                    className="p-0"
                    key={index}
                    avatar={{
                      uri: avatars?.find(
                        (x) => player?.user.styles?.avatarId === x.id
                      )?.style.url,
                    }}
                    name={player.user.name}
                    username={player.user.username}
                  />
                ))}
            </View>
          </View>
        </ScrollView>

        {game && game.admin.id === user?.id && (
          <View className="absolute bottom-12 px-[5%] gap-2 flex flex-1 flex-row items-center">
            <Button onPress={routes} className="flex-1 w-auto" text="Маршрут" />
            <Button
              onPress={start}
              className="flex-1 w-auto bg-navigation"
              text={game && game?.state === "game" ? "К игре" : "Начать"}
            />
          </View>
        )}

        <StatusBar style="light" />
      </View>
    </View>
  );
};
