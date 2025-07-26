import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGameStore } from "@/shared/stores/game.store";
import { GameStackParamList } from "@/routers/game.navigator";
import { MainStackParamList } from "@/routers/main.navigator";
import { DEFAULT_MAP_CAMERA_LOCATION } from "@/constants";
import { useGeolocationStore } from "@/shared/stores/location.store";
import { BlurView } from "expo-blur";
import { RouteMarker } from "@/components/ui/map/route-marker";
import { isPause } from "@/shared/interfaces/polls/pause";
import { ModalCardProps } from "@/components/widgets/modal-card";
import { useModal } from "@/shared/hooks/useModal";
import { isTaskPoll } from "@/shared/interfaces/polls/task-poll";
import { PlaceMarker } from "@/components/ui/map/place-marker";
import { hasAvatar, isMe } from "@/shared/interfaces/user";
import { useOverlays } from "@/shared/providers/overlay.provider";
import { isPlayerPoll } from "@/shared/interfaces/polls/player-poll";

type NavProp = StackNavigationProp<
  GameStackParamList & MainStackParamList,
  "Game"
>;

export const GameScreen = () => {
  const { openOverlay, closeOverlay, isOverlayOpen } = useOverlays();

  const cameraRef = useRef<Camera>(null);

  const navigation = useNavigation<NavProp>();
  const { game, updateStatus, resetChat, setGame, addCompletedTaskPoint } =
    useGameStore();
  const { location } = useGeolocationStore();
  const { user } = useAuthStore();
  const { emit, on } = useSocket();
  const { data: avatars, getStyle } = useStyles({ type: "avatar" });
  const [leaderboardOpened, setLeaderboardOpened] = useState<boolean>(false);
  const leaderboardSheet = useRef<BottomSheet>(null);

  const { setModalOpen } = useModal();

  const togglePauseGame = useCallback(() => {
    if (!game) return;
    if (
      game.activePoll &&
      game.activePoll.state === "active" &&
      isPause(game.activePoll)
    ) {
      emit("unpause");
    } else {
      emit("pause", { pollDuration: 5 });
    }
  }, [game]);

  useEffect(() => {
    if (!game || !game.activePoll) return;
    const poll = game.activePoll;

    if (isTaskPoll(poll) && poll.state === "active") {
      if (poll.data) {
        openOverlay("taskCompleted");
      }
    }
    if (isTaskPoll(poll) && poll.state === "finished") {
      if (poll.result.taskComplete.approved) {
        closeOverlay();
        addCompletedTaskPoint(poll.result.taskComplete.completedTaskPoint);
      }
    }

    if (isPlayerPoll(poll) && poll.state === "active") {
      if (poll.data) {
        openOverlay("taskCompleted");
      }
    }
    if (isTaskPoll(poll) && poll.state === "finished") {
      if (poll.result.taskComplete.approved) {
        closeOverlay();
        addCompletedTaskPoint(poll.result.taskComplete.completedTaskPoint);
      }
    }

    if (isPause(poll) && poll.state === "active")
      openOverlay("pause", undefined);
    if (isPause(poll) && poll.state === "finished") closeOverlay();
  }, [game?.activePoll]);

  on("playerRoleUpdated", ({ player, role }) => {
    // if (role == "catcher")
    //   openOverlay("updateRole", {
    //     player,
    //   });
    // setTimeout(() => {
    //   console.log("HEEEEEEEEEey")
    //   closeOverlay();
    // }, 5000);
  });

  const players = game?.players ?? [];

  const exit = () => {
    setModalOpen(false);
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
    openOverlay("chat");
  };

  useEffect(() => {
    if (!game) return;
    if (location) {
      emit("locationUpdate", {
        location: { lon: location[0], lat: location[1] },
      });
    }
  }, [location]);

  const modalOptions: ModalCardProps = {
    title: "Выйти из игры?",
    subtitle:
      "Вы точно хотите завершить забег? Ваш прогресс будет сохранён, но бегуны разбегутся..",
    buttons: [
      {
        text: "Выйти",
        type: "primary",
        onClick: exit,
      },
      {
        text: "Отмена",
        type: "secondary",
        onClick: () => setModalOpen(false),
      },
    ],
  };

  return (
    <View className="flex-1">
      <Map>
        {players && game && user && location && (
          <>
            {players.map((player, index) => (
              <PlayerMarker
                key={index}
                coordinate={
                  isMe(player.user, user)
                    ? { lon: location[0], lat: location[1] }
                    : player.location
                }
                pulse={player.role == "catcher"}
                name={player.user.name}
                avatarSrc={{
                  uri:
                    hasAvatar(player.user) &&
                    getStyle(player.user.styles.avatarId)?.style.url,
                }}
              />
            ))}
          </>
        )}
        {game && game.route && (
          <RouteMarker
            path={game.route.taskPoints}
            shapes={game.route.taskPoints.map((point) => {
              const disabled =
                game.completedTaskPoints.find((x) => x.pointId === point.id) !==
                undefined;

              const openTaskPoint = () => {
                openOverlay("camera", {
                  action: {
                    type: "completeTask",
                    taskId: point.id,
                  },
                });
              };

              return (
                <PlaceMarker
                  key={point.id}
                  coordinate={[point.location.lon, point.location.lat]}
                  disabled={disabled}
                  onPress={openTaskPoint}
                />
              );
            })}
          />
        )}
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: location || DEFAULT_MAP_CAMERA_LOCATION,
            zoomLevel: 12,
          }}
        />
      </Map>
      {!isOverlayOpen("chat") && (
        <View className="absolute px-[5%] gap-4 bottom-12 flex items-center flex-row left-0 right-0 z-10">
          <Pressable onPress={togglePauseGame}>
            <IconContainer>
              {isOverlayOpen("pause") ? <Icons.Play /> : <Icons.Pause />}
            </IconContainer>
          </Pressable>

          <Button
            onPress={() => {
              openOverlay("camera", {
                action: {
                  type: "catchPlayer",
                  playerId:
                    game?.players.filter((p) => p.role == "runner")[0].user
                      .id ?? "",
                },
              });
            }}
            text="Поймать"
            className="flex-1"
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
            onPress={() =>
              isOverlayOpen() ? closeOverlay : () => setModalOpen(modalOptions)
            }
          >
            <IconContainer>
              {isOverlayOpen() ? <Icons.Back /> : <Icons.Exit />}
            </IconContainer>
          </Pressable>

          <Pressable
            onPress={() => {
              closeOverlay();
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
      <LeaderboardSheet
        onPlayerPress={(player) => {
          const offset = 0.002;
          cameraRef.current?.fitBounds(
            [player.location.lon - offset, player.location.lat - offset],
            [player.location.lon + offset, player.location.lat + offset],
            100,
            1000
          );
          leaderboardSheet.current?.close();
        }}
        ref={leaderboardSheet}
        players={game?.players ?? []}
        children={undefined}
      />
      <StatusBar style="dark" />
    </View>
  );
};
