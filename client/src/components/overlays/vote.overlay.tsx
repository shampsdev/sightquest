import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import { useGameStore } from "@/shared/stores/game.store";
import { isPlayerPoll } from "@/shared/interfaces/polls/player-poll";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { hasAvatar } from "@/shared/interfaces/user";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useSocket } from "@/shared/hooks/useSocket";
import { isTaskPoll } from "@/shared/interfaces/polls/task-poll";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface VoteOverlayProps {
  visible?: boolean;
}

export const VoteOverlay = ({ visible }: VoteOverlayProps) => {
  const insets = useSafeAreaInsets();
  const { getStyle } = useStyles({ type: "avatar" });
  const opacity = useSharedValue(0);
  const progress = useSharedValue(1);
  const [remainingTime, setRemainingTime] = useState(0);

  const { game } = useGameStore();
  const { emit } = useSocket();

  const [voted, setVoted] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (visible && game?.activePoll?.duration) {
      const startTime = Date.now();
      const duration = game.activePoll.duration * 1000; // Convert to ms

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const newProgress = remaining / duration;

        const remainingSeconds = remaining / 1000;

        // Smooth animation with timing function
        progress.value = withTiming(newProgress, {
          duration: 100, // Smooth 100ms transition
          easing: Easing.linear, // Linear easing for consistent speed
        });

        setRemainingTime(remainingSeconds);

        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 100); // Update every 100ms

      return () => clearInterval(interval);
    }
  }, [visible, game?.activePoll?.duration]);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
    if (!visible) setVoted(false);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const approve = () => {
    if (game?.activePoll) {
      setVoted(true);
      if (isTaskPoll(game.activePoll)) {
        emit("taskApprove");
      } else {
        emit("playerCatchApprove");
      }
    }
  };

  const reject = () => {
    if (game?.activePoll) {
      setVoted(true);
      if (isTaskPoll(game.activePoll)) {
        emit("taskReject");
      } else {
        emit("playerCatchReject");
      }
    }
  };

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute w-full mx-auto h-full z-30"
      pointerEvents={visible ? "auto" : "none"}
    >
      <View className="absolute top-20 w-full z-40">
        <View className="w-full px-[36px] mx-auto flex-row items-center gap-4">
          {/* Progress Bar - flex-1 to take remaining space */}
          <View className="flex-1 h-1 bg-[#B6B6B6] rounded-full overflow-hidden">
            <Animated.View
              style={progressStyle}
              className="h-full bg-accent_primary rounded-full"
            />
          </View>

          {/* Timer Text */}
          <Text className="font-bounded-bold text-md text-text_primary">
            {formatTime(remainingTime)} {/* You'll need to implement this */}
          </Text>
        </View>
      </View>

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
                ? "Бегун пойман!"
                : "Задание"}
            </Text>
            <Text className="text-center text-text_secondary pt-2">
              {game?.activePoll && isTaskPoll(game.activePoll)
                ? `task text`
                : "Голосуйте за кадр!"}
            </Text>
          </View>
          <View className="w-full relative aspect-square mx-auto rounded-[40px] z-10 overflow-hidden">
            {game?.activePoll && isPlayerPoll(game.activePoll) && (
              <>
                <Image
                  source={{ uri: game.activePoll.data.playerCatch.photo }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                />
                <View className="absolute bottom-5 left-5 flex flex-row gap-2 rounded-full overflow-hidden">
                  <Avatar
                    className="z-20 m-[5px]"
                    source={{
                      uri:
                        hasAvatar(
                          game.activePoll.data.playerCatch.runner.user
                        ) &&
                        getStyle(
                          game.activePoll.data.playerCatch.runner.user.styles
                            .avatarId
                        )?.style.url,
                    }}
                  ></Avatar>
                  <View className="flex flex-col justify-center z-20 py-2 pr-4">
                    <Text className="text-text_primary text-xl font-bounded-bold">
                      {game.activePoll.data.playerCatch.runner.user.name}
                    </Text>
                    <Text className="text-text_secondary">Убегающий</Text>
                  </View>
                  <BlurView
                    intensity={50}
                    tint="dark"
                    className="absolute w-full h-full z-10"
                  />
                </View>
              </>
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
                  <Avatar
                    className="z-20 m-[5px]"
                    source={{
                      uri:
                        hasAvatar(
                          game.activePoll.data.taskComplete.player.user
                        ) &&
                        getStyle(
                          game.activePoll.data.taskComplete.player.user.styles
                            .avatarId
                        )?.style.url,
                    }}
                  ></Avatar>
                  <View className="flex flex-col justify-center z-20 py-2 pr-4">
                    <Text className="text-text_primary text-xl font-bounded-bold">
                      {game.activePoll.data.taskComplete.player.user.name}
                    </Text>
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

        <View className="h-[86px] w-full"></View>
      </View>

      <View
        className="absolute bottom-0 flex flex-row px-[5%] items-center justify-center w-full z-40"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        {voted ? (
          <Text className="text-text_primary font-bounded-bold text-xl">
            Проголосовали {game?.activePoll?.votes?.length || 0} из{" "}
            {game?.players.length}
          </Text>
        ) : (
          <>
            <Button
              onPress={reject}
              text="Отклонить"
              className="flex-1 w-auto bg-[rgba(0,0,0,0)]"
            />
            <Button
              onPress={approve}
              text="Принять"
              className="flex-1 w-auto"
            />
          </>
        )}
      </View>
    </Animated.View>
  );
};
