import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import {
  Pressable,
  View,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import { useTaskCompletionStore } from "@/shared/stores/camera.store";
import { useGame } from "@/shared/api/hooks/useGame";
import { useGameStore } from "@/shared/stores/game.store";
import { isTaskPoll } from "@/shared/interfaces/polls/task-poll";

interface TaskCompletedOverlayProps {
  visible?: boolean;
}

export const TaskCompletedOverlay = ({
  visible,
}: TaskCompletedOverlayProps) => {
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

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute w-full h-full flex justify-end items-center z-30"
      pointerEvents={visible ? "auto" : "none"}
    >
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={100}
        tint="dark"
        className="absolute w-full h-full z-10"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ zIndex: 30 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        className={twMerge(
          "py-[40px] h-[85%] mb-[80px] flex-1 rounded-[30px] w-full z-30 flex flex-col justify-end gap-16"
        )}
      >
        <View className="flex flex-col justify-center">
          <View className="w-[360px] h-[360px] rounded-[16px] overflow-hidden">
            {game?.activePoll &&
              isTaskPoll(game.activePoll) &&
              game.activePoll.state == "active" && (
                <Image
                  source={{
                    uri: game.activePoll.data.taskComplete.photo,
                  }}
                  style={{ width: 360, height: 360 }}
                />
              )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
