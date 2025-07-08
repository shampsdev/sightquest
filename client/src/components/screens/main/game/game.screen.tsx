import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageSourcePropType, Pressable, Text, View } from "react-native";
import { Camera } from "@rnmapbox/maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "@/components/ui/avatar";
import { AvatarStackSmall } from "@/components/ui/avatar-stack";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { PlayerMarker } from "@/components/ui/map/player-marker";
import { Button } from "@/components/ui/button";
import { Map } from "@/components/widgets/map";
import { LeaderboardSheet } from "@/components/widgets/leaderboard-sheet";
import { ChatScreen } from "./chat.screen";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGameStore } from "@/shared/stores/game.store";
import { GameStackParamList } from "@/routers/game.navigator";
import { MainStackParamList } from "@/routers/main.navigator";
import { DEFAULT_MAP_CAMERA_LOCATION } from "@/constants";
import { useGeolocationStore } from "@/shared/stores/location.store";
import { ModalCard } from "@/components/widgets/modal-card";
import { BlurView } from "expo-blur";
import { RouteMarker } from "@/components/ui/map/route-marker";
import { PauseScreen } from "./pause.screen";
import { isPause } from "@/shared/interfaces/polls/pause";
import { CameraOverlay } from "@/components/overlays/camera";
import { useCamera } from "@/shared/hooks/useCamera";
import { SendPhotoOverlay } from "@/components/overlays/send-photo";

type NavProp = StackNavigationProp<
  GameStackParamList & MainStackParamList,
  "Game"
>;

export const GameScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { game, updateStatus, resetChat, setGame } = useGameStore();
  const { location } = useGeolocationStore();
  const { user } = useAuthStore();
  const { emit } = useSocket();
  const { data: avatars } = useStyles({ type: "avatar" });

  const [leaderboardOpened, setLeaderboardOpened] = useState<boolean>(false);
  const leaderboardSheet = useRef<BottomSheet>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const [chatOpened, setChatOpened] = useState<boolean>(false);
  const [pauseOpened, setPauseOpened] = useState<boolean>(false);
  const [cameraOverlayOpened, setCameraOverlayOpened] =
    useState<boolean>(false);
  const [sendPhotoOverlayOpened, setSendPhotoOverlayOpened] =
    useState<boolean>(false);

  const togglePauseGame = useCallback(() => {
    if (!game) return;

    if (
      game.activePoll &&
      game.activePoll.state === "active" &&
      isPause(game.activePoll)
    ) {
      emit("unpause");
    } else {
      emit("pause", { duration: 5 });
    }
  }, [game]);

  useEffect(() => {
    if (!game || !game.activePoll) return;
    const poll = game.activePoll;

    if (isPause(poll) && poll.state === "active") setPauseOpened(true);
    if (isPause(poll) && poll.state === "finished") setPauseOpened(false);
  }, [game]);

  const players = game?.players ?? [];

  const exit = () => {
    emit("leaveGame");
    updateStatus("leaved");
    setGame(null);
    resetChat();
    navigation.navigate("Home");
  };

  const openChat = () => {
    if (leaderboardOpened) {
      leaderboardSheet.current?.close();
    }
    setChatOpened(true);
  };

  useEffect(() => {
    if (!game) return;
    if (location) {
      emit("locationUpdate", {
        location: { lon: location[0], lat: location[1] },
      });
    }
  }, [location]);

  return (
    <View className="flex-1">
      {!cameraOverlayOpened && !sendPhotoOverlayOpened && (
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

          {game && game?.route && (
            <RouteMarker
              points={game.route.taskPoints.map((x) => [
                x.location.lon,
                x.location.lat,
              ])}
              path={game.route.taskPoints.map((x) => [
                x.location.lon,
                x.location.lat,
              ])}
            />
          )}
          <Camera
            defaultSettings={{
              centerCoordinate: location || DEFAULT_MAP_CAMERA_LOCATION,
              zoomLevel: 12,
            }}
          />
        </Map>
      )}
      {!chatOpened && (
        <View className="absolute px-[5%] gap-4 bottom-12 flex items-center flex-row left-0 right-0 z-10">
          <Pressable onPress={togglePauseGame}>
            <IconContainer>
              {pauseOpened ? <Icons.Play /> : <Icons.Pause />}
            </IconContainer>
          </Pressable>

          <Button
            text="Поймать"
            className="flex-1"
            onPress={() => setCameraOverlayOpened(true)}
          />

          <Pressable onPress={openChat}>
            <IconContainer>
              <Icons.Chat />
            </IconContainer>
          </Pressable>
        </View>
      )}

      <View className="absolute top-20 w-full z-40">
        <View className="w-[90%] mx-auto flex-row justify-between items-center">
          <Pressable
            onPress={
              chatOpened || cameraOverlayOpened || sendPhotoOverlayOpened
                ? () => {
                    setChatOpened(false);
                    setCameraOverlayOpened(false);
                    setSendPhotoOverlayOpened(false);
                  }
                : () => setModalOpened(true)
            }
          >
            <IconContainer>
              {(chatOpened ||
                cameraOverlayOpened ||
                sendPhotoOverlayOpened) && <Icons.Back />}
              {!chatOpened &&
                !cameraOverlayOpened &&
                !sendPhotoOverlayOpened && <Icons.Exit />}
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
            className="bg-[#67676780] overflow-hidden rounded-full"
          >
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              className="gap-[10px] px-[20px] items-center flex flex-row justify-center"
              intensity={10}
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
            </BlurView>
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
      {modalOpened && (
        <ModalCard
          title={"Выйти из игры?"}
          subtitle={
            "Вы точно хотите завершить забег? Ваш прогресс будет сохранён, но бегуны разбегутся.."
          }
          confirmText="Выйти"
          rejectText="Отмена"
          onReject={() => setModalOpened(false)}
          onConfirm={exit}
        />
      )}

      {chatOpened && (
        <ChatScreen visible={chatOpened} onClose={() => setChatOpened(false)} />
      )}
      {pauseOpened && <PauseScreen visible={pauseOpened} />}

      {cameraOverlayOpened && (
        <CameraOverlay
          visible={cameraOverlayOpened}
          onClose={() => setCameraOverlayOpened(false)}
          onSucces={() => {
            setCameraOverlayOpened(false);
            setSendPhotoOverlayOpened(true);
          }}
        />
      )}

      {sendPhotoOverlayOpened && (
        <SendPhotoOverlay
          visible={sendPhotoOverlayOpened}
          onClose={() => setSendPhotoOverlayOpened(false)}
        />
      )}

      <LeaderboardSheet
        ref={leaderboardSheet}
        players={game?.players ?? []}
        children={undefined}
      />
      <StatusBar style="dark" />
    </View>
  );
};
