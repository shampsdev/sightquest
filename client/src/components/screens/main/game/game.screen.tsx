import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Camera } from "@rnmapbox/maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "@/components/ui/avatar";
import { AvatarStackSmall } from "@/components/ui/avatar-stack";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { Button } from "@/components/ui/button";
import { Map } from "@/components/widgets/map";
import { LeaderboardSheet } from "@/components/widgets/leaderboard-sheet";
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
import { isPlayerPoll } from "@/shared/interfaces/polls/player-poll";
import { hasAvatar, isMe } from "@/shared/interfaces/user";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { PlayerMarker } from "@/components/ui/map/player-marker";
import { useOverlays } from "@/shared/hooks/useOverlays";
import { usePlayer } from "@/shared/hooks/usePlayer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavProp = StackNavigationProp<
  GameStackParamList & MainStackParamList,
  "Game"
>;

export const GameScreen = () => {
  const insets = useSafeAreaInsets();
  const { openOverlay, closeOverlay, isOverlayOpen } = useOverlays();

  const { user } = useAuthStore();
  const { getStyle } = useStyles({ type: "avatar" });

  const cameraRef = useRef<Camera>(null);

  const navigation = useNavigation<NavProp>();
  const {
    game,
    updateStatus,
    resetChat,
    unreadMessages,
    setGame,
    addCompletedTaskPoint,
  } = useGameStore();
  const { location } = useGeolocationStore();
  const { emit } = useSocket();
  const [leaderboardOpened, setLeaderboardOpened] = useState<boolean>(false);
  const leaderboardSheet = useRef<BottomSheet>(null);

  const { player } = usePlayer();

  const { setModalOpen } = useModal();

  useEffect(() => {
    openOverlay("startGame", {
      players: game?.players,
      route: game?.route ?? undefined,
    });
    setTimeout(() => {
      closeOverlay("startGame");
    }, 3000);
  }, []);

  useEffect(() => {
    if (game?.state == "finished") {
      openOverlay("startGame", {
        players: game?.players,
        route: game?.route ?? undefined,
      });
      setTimeout(() => {
        closeOverlay("startGame");
        exit();
      }, 3000);
    }
  }, [game]);

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
      closeOverlay();
      if (poll.result.taskComplete.approved) {
        addCompletedTaskPoint(poll.result.taskComplete.completedTaskPoint);
      }
      openOverlay("result");
      setTimeout(() => {
        closeOverlay("result");
      }, 3000);
    }

    if (isPlayerPoll(poll) && poll.state === "active") {
      if (poll.data) {
        openOverlay("taskCompleted");
      }
    }
    if (isPlayerPoll(poll) && poll.state === "finished") {
      closeOverlay();
      openOverlay("result");
      setTimeout(() => {
        closeOverlay("result");
      }, 3000);
    }

    if (isPause(poll) && poll.state === "active") openOverlay("pause");
    if (isPause(poll) && poll.state === "finished") closeOverlay();
  }, [game?.activePoll]);

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

  const exitModalOptions: ModalCardProps = {
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
        {players &&
          players.map(
            (player, index) =>
              user &&
              (isMe(player.user, user) ||
                (player.location.lat !== 0 && player.location.lon)) && (
                <PlayerMarker
                  key={index}
                  player={player}
                  pulse={player.role == "runner"}
                />
              )
          )}
        {game && game.route && (
          <RouteMarker
            path={game.route.taskPoints}
            shapes={game.route.taskPoints.map((point) => {
              const completedTaskPoint = game.completedTaskPoints.find(
                (x) => x.pointId === point.id
              );

              const openTaskPoint = () => {
                openOverlay("taskPoint", {
                  taskPoint: point,
                  completedTaskPoint,
                });
              };

              return (
                <PlaceMarker
                  key={point.id}
                  coordinate={[point.location.lon, point.location.lat]}
                  disabled={completedTaskPoint !== undefined}
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
        <View
          className="absolute px-[5%] gap-4 flex items-center justify-between flex-row left-0 right-0 z-10"
          style={{ bottom: Math.max(insets.bottom, 12) }}
        >
          <Pressable onPress={togglePauseGame}>
            <IconContainer>
              {isOverlayOpen("pause") ? <Icons.Play /> : <Icons.Pause />}
            </IconContainer>
          </Pressable>

          {player?.role == "catcher" && (
            <Button
              onPress={() => {
                const runner = game?.players.filter(
                  (p) => p.role == "runner"
                )[0];
                if (runner)
                  openOverlay("camera", {
                    action: {
                      type: "catchPlayer",
                      player: runner,
                    },
                  });
              }}
              text="Поймать"
              className="flex-1"
            />
          )}
          <Pressable onPress={openChat}>
            <IconContainer active={unreadMessages}>
              <Icons.Chat />
            </IconContainer>
          </Pressable>
        </View>
      )}
      {!isOverlayOpen() ? (
        <View className="absolute top-20 w-full z-40">
          <View className="w-[90%] mx-auto flex-row justify-between items-center">
            <Pressable
              onPress={() =>
                isOverlayOpen()
                  ? closeOverlay()
                  : setModalOpen(exitModalOptions)
              }
            >
              <IconContainer>
                <Icons.Exit />
              </IconContainer>
            </Pressable>

            <Pressable
              onPress={() => {
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
                className="gap-[10px] px-[20px] items-center flex flex-row justify-center"
                intensity={10}
              >
                <AvatarStackSmall
                  users={players.map((p) => p.user)}
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
                    uri:
                      hasAvatar(user) &&
                      getStyle(user.styles.avatarId)?.style.url,
                  }}
                />
              </Pressable>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}
      <LeaderboardSheet
        onPlayerPress={(player) => {
          const offset = 0.002;
          if (user && isMe(player.user, user) && location) {
            cameraRef.current?.fitBounds(
              [location[0] - offset, location[1] - offset],
              [location[0] + offset, location[1] + offset],
              100,
              1000
            );
          } else {
            cameraRef.current?.fitBounds(
              [player.location.lon - offset, player.location.lat - offset],
              [player.location.lon + offset, player.location.lat + offset],
              100,
              1000
            );
          }
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
