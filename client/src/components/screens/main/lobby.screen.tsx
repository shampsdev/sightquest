import { Header } from "@/components/ui/header";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { UserLobbyPreview } from "@/components/widgets/user/user-preview.lobby";
import { AVATARS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { useGameStore } from "@/shared/stores/game.store";
import { useSocketStore } from "@/shared/stores/socket.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect } from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const LobbyScreen = () => {
  const { game } = useGameStore();
  const { emit } = useSocketStore();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const back = () => {
    navigation.goBack();
  };

  useEffect(() => {
    emit("joinGame", { gameId: game?.id ?? "" });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-bg_primary">
      <ScrollView className="w-full pt-[36px]">
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

          <View className="rounded-[40px] bg-navigation justify-center">
            <Text className="font-bounded-regular text-text_primary text-[24px]">
              {game?.id}
            </Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
