import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { View, Image, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import { useGameStore } from "@/shared/stores/game.store";
import { isPlayerPoll } from "@/shared/interfaces/polls/player-poll";
import { Avatar } from "../ui/avatar";
import { hasAvatar } from "@/shared/interfaces/user";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { isTaskPoll } from "@/shared/interfaces/polls/task-poll";
import { AvatarCard } from "../widgets/avatar-card";
import { useOverlays } from "@/shared/hooks/useOverlays";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { logger } from "@/shared/instances/logger.instance";

export interface ResultOverlayProps {
  visible?: boolean;
}

export const ResultOverlay = ({ visible }: ResultOverlayProps) => {
  const insets = useSafeAreaInsets();
  const { getStyle } = useStyles({ type: "avatar" });
  const opacity = useSharedValue(0);

  const { game } = useGameStore();

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const isFinished = game?.activePoll?.state === "finished";

  // Precompute safe entities
  const playerCatch =
    game?.activePoll && isPlayerPoll(game.activePoll)
      ? game.activePoll.result?.playerCatch ?? null
      : null;
  const newRunnerUser = playerCatch?.newRunner?.user ?? null;

  if (
    isFinished &&
    game?.activePoll &&
    isPlayerPoll(game.activePoll) &&
    !newRunnerUser
  ) {
    logger.error("ui", "ResultOverlay: missing newRunner.user", playerCatch);
  }

  return (
    isFinished && (
      <Animated.View
        style={animatedStyle}
        className="absolute w-full mx-auto h-full z-30"
        pointerEvents={visible ? "auto" : "none"}
      >
        {/* Blur background */}
        <BlurView
          intensity={100}
          tint="dark"
          className="absolute w-full h-full z-10"
        />

        {/* Main content container - IDENTICAL to CameraOverlay */}
        <View
          style={{ zIndex: 30 }}
          className={twMerge(
            "px-[36px] mx-auto flex-1 rounded-[30px] w-full z-30 flex flex-col justify-center gap-16"
          )}
        >
          <View className="h-[86px] w-full"></View>
          <View className="flex flex-col w-full justify-center mx-auto">
            <View className="w-full flex justify-center pb-8">
              <Text className="text-center pt-2 text-text_primary font-bounded-bold text-3xl">
                {game?.activePoll && isPlayerPoll(game.activePoll)
                  ? "Новый убегающий"
                  : "Задание принято"}
              </Text>
              <Text className="text-center text-text_secondary pt-2">
                {game?.activePoll && isTaskPoll(game.activePoll)
                  ? `task text`
                  : "Голосование завершено! Назначена новая цель"}
              </Text>
            </View>
            <View className="w-full relative aspect-square mx-auto rounded-[40px] z-10 overflow-hidden">
              {game?.activePoll && isPlayerPoll(game.activePoll) && (
                <View className="h-full w-full flex justify-center items-center">
                  {newRunnerUser ? (
                    <AvatarCard
                      avatar={
                        hasAvatar(newRunnerUser)
                          ? getStyle(newRunnerUser.styles.avatarId)?.style
                              .url ?? ""
                          : ""
                      }
                      title={newRunnerUser?.name ?? ""}
                      subtitle={newRunnerUser?.username ?? ""}
                    />
                  ) : (
                    <View className="items-center justify-center">
                      <Text className="text-text_primary text-xl font-bounded-bold">
                        Голосование отклонено
                      </Text>
                      <Text className="text-text_secondary mt-2">
                        Новый убегающий не назначен
                      </Text>
                    </View>
                  )}
                </View>
              )}
              {game?.activePoll && isTaskPoll(game.activePoll) && (
                <>
                  <Image
                    source={{ uri: game.activePoll.data.taskComplete.photo }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-5 left-5 flex flex-row gap-2 rounded-full overflow-hidden">
                    {game.activePoll.data.taskComplete.player?.user && (
                      <Avatar
                        className="z-20 m-[5px]"
                        source={{
                          uri: hasAvatar(
                            game.activePoll.data.taskComplete.player.user
                          )
                            ? getStyle(
                                game.activePoll.data.taskComplete.player.user
                                  .styles.avatarId
                              )?.style.url ?? ""
                            : "",
                        }}
                      />
                    )}
                    <View className="flex flex-col justify-center z-20 py-2 pr-4">
                      {game.activePoll.data.taskComplete.player?.user && (
                        <Text className="text-text_primary text-xl font-bounded-bold">
                          {game.activePoll.data.taskComplete.player.user.name}
                        </Text>
                      )}
                      <Text className="text-text_secondary">
                        Выполнил задание
                      </Text>
                    </View>
                    <BlurView
                      intensity={50}
                      tint="dark"
                      className="absolute w-full h-full z-10"
                    />
                  </View>
                </>
              )}
            </View>
          </View>

          <View
            style={{ height: 86 + Math.max(insets.bottom, 0) }}
            className="w-full"
          />
        </View>
      </Animated.View>
    )
  );
};
