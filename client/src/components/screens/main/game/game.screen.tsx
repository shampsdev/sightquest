import { Avatar } from "@/components/ui/avatar";
import { AvatarStack, AvatarStackSmall } from "@/components/ui/avatar-stack";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { PlayerMarker } from "@/components/ui/map/player-marker";
import { LeaderboardSheet } from "@/components/widgets/leaderboard-sheet";
import { Map } from "@/components/widgets/map";
import { GameStackParamList } from "@/routers/game.navigator";
import { MainStackParamList } from "@/routers/main.navigator";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGameStore } from "@/shared/stores/game.store";
import BottomSheet from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Camera } from "@rnmapbox/maps";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { ImageSourcePropType, Pressable, Text, View } from "react-native";
import { ChatScreen } from "./chat.screen";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { DEFAULT_MAP_CAMERA_LOCATION } from "@/constants";

type NavProp = StackNavigationProp<
  GameStackParamList & MainStackParamList,
  "Game"
>;

export const GameScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { game, updateStatus, resetChat, setGame } = useGameStore();

  const [leaderboardOpened, setLeaderboardOpened] = useState<boolean>(false);
  const [chatOpened, setChatOpened] = useState<boolean>(false);

  const { user } = useAuthStore();

  const { emit } = useSocket();

  const { data: avatars } = useStyles({ type: "avatar" });

  const location = useGeolocation();

  const players = game?.players ?? [];

  const leaderboardSheet = useRef<BottomSheet>(null);

  const exit = () => {
    emit("leaveGame");
    updateStatus("leaved");
    setGame(null);
    resetChat();
    navigation.navigate("Home");
  };

  useEffect(() => {
    if (location)
      emit("locationUpdate", {
        location: { lon: location[0], lat: location[1] },
      });
  }, [location]);

  return (
    <View className="flex-1">
      <Map>
        {location && players && (
          <>
            {players?.map((player, index) => (
              <PlayerMarker
                key={index}
                coordinate={
                  player.user.id === user?.id
                    ? { lon: location[0], lat: location[1] }
                    : player.location
                }
                name={player?.user.name ?? player.user.username}
                avatarSrc={{
                  uri: avatars?.find(
                    (x) => x.id === player.user.styles?.avatarId
                  )?.style.url,
                }}
              />
            ))}
          </>
        )}
        <Camera
          defaultSettings={{
            centerCoordinate: location || DEFAULT_MAP_CAMERA_LOCATION,
            zoomLevel: 12,
          }}
        />
      </Map>
      {!chatOpened && (
        <View className="absolute bottom-[36px] flex flex-row left-0 right-0 z-10">
          <Button
            onPress={() => {
              if (leaderboardOpened) {
                leaderboardSheet.current?.close();
              }
              setChatOpened(true);
            }}
            text="Chat"
            className="mx-auto"
          />
        </View>
      )}

      <View className="absolute top-20 w-full z-20">
        <View className="w-[90%] mx-auto flex-row justify-between items-center">
          <Pressable onPress={chatOpened ? () => setChatOpened(false) : exit}>
            <IconContainer>
              {chatOpened && <Icons.Back />}
              {!chatOpened && <Icons.Exit />}
            </IconContainer>
          </Pressable>

          <Pressable
            onPress={() => {
              setChatOpened(false);

              setLeaderboardOpened(!leaderboardOpened);
              if (leaderboardOpened) {
                leaderboardSheet.current?.close();
              } else {
                leaderboardSheet.current?.snapToIndex(0);
              }
            }}
            className="bg-[#67676780] gap-[10px] items-center flex flex-row justify-center rounded-full px-[20px]"
          >
            <AvatarStackSmall
              avatars={
                players
                  ?.map((player) => ({
                    uri: avatars?.find(
                      (x) => x.id === player.user.styles?.avatarId
                    )?.style.url,
                  }))
                  .filter(
                    (avatar) => avatar !== undefined
                  ) as ImageSourcePropType[]
              }
              avatarWidth={25}
            />
            <View className="flex flex-row items-center">
              <Text className="font-bounded-regular text-[#FFF]">
                Таблица игроков
              </Text>
              <View className="relative w-[20px]">
                <View className="absolute bottom-[-12px]">
                  <Icons.DownArrow />
                </View>
              </View>
            </View>
          </Pressable>

          {user && (
            <Pressable onPress={() => {}}>
              <Avatar
                className="h-12 w-12"
                source={{
                  uri: avatars?.find((x) => x.id === user.styles?.avatarId)
                    ?.style.url,
                }}
              />
            </Pressable>
          )}
        </View>
      </View>

      <ChatScreen visible={chatOpened} onClose={() => setChatOpened(false)} />

      <LeaderboardSheet
        ref={leaderboardSheet}
        players={game?.players ?? []}
        children={undefined}
      />
      <StatusBar style="dark" />
    </View>
  );
};
