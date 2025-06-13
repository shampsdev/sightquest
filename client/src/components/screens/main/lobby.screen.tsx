import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { UserLobbyPreview } from "@/components/widgets/user/user-preview.lobby";
import { AVATARS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { useGame } from "@/shared/api/hooks/useGame";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGameStore } from "@/shared/stores/game.store";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LobbyRoute = RouteProp<MainStackParamList, "Lobby">;

export const LobbyScreen = () => {
  const { emit, reconnect } = useSocket();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { setGame, game } = useGameStore();
  const { user } = useAuthStore();

  const { params } = useRoute<LobbyRoute>();
  const { data: initialGame, isLoading, error } = useGame(params.gameId);

  useEffect(() => {
    console.log(`[admin id] > ${game?.admin.id}`);
    console.log(`[user id] > ${user?.id}`);
  }, [game]);

  useEffect(() => {
    if (error !== null) {
      console.info(error);
    }
    if (!isLoading && !error && initialGame !== undefined) {
      setGame(initialGame);
      emit("joinGame", { gameId: initialGame.id });
    }

    return () => {
      if (!isLoading && !error && initialGame !== undefined) {
        reconnect();
      }
    };
  }, [isLoading, error, initialGame]);

  if (isLoading) return <Text>Loading game…</Text>;
  if (error) return <Text>Couldn’t load game.</Text>;

  const back = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-bg_primary">
      <ScrollView className="w-full">
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
                  key={index}
                  avatar={AVATARS[0].src}
                  name={player.user.name ?? ""}
                  username={player.user.username ?? ""}
                />
              ))}
          </View>

          {game && game.admin.id === user?.id && (
            <Button
              onPress={() => console.log("kek")}
              className="flex-1 w-auto"
              text="Старт"
            />
          )}
        </View>
        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaView>
  );
};
