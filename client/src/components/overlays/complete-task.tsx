import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";
import { uploadImageToS3 } from "@/shared/api/s3.api";
import { logger } from "@/shared/instances/logger.instance";
import { useGameStore } from "@/shared/stores/game.store";
import { useSocket } from "@/shared/hooks/useSocket";
import { usePlayer } from "@/shared/hooks/usePlayer";
import { useTaskCompletionStore } from "@/shared/stores/camera.store";

interface CompleteTaskOverlayProps {
  visible?: boolean;
  onClose: () => void;
}

export const CompleteTaskOverlay = ({
  visible,
  onClose,
}: CompleteTaskOverlayProps) => {
  const { photo, taskId } = useTaskCompletionStore();
  const { emit } = useSocket();

  const { player } = usePlayer();
  const opacity = useSharedValue(0);

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
      <Pressable
        onPress={onClose}
        className="absolute top-0 left-0 right-0 bottom-0"
      />
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
            <Image
              source={{ uri: photo?.uri }}
              style={{ width: 360, height: 360 }}
            />
          </View>
        </View>

        <View className="flex flex-row gap-[53px] pb-12 items-center justify-center w-full">
          <Button
            text="Отправить"
            onPress={async () => {
              const result = await uploadImageToS3(
                photo?.uri ?? "",
                undefined,
                "games"
              );

              if (player?.role === "catcher") {
                emit("taskComplete", {
                  taskId: taskId ?? "",
                  photo: result.url,
                });
              }

              if (player?.role === "runner") {
                emit("taskComplete", {
                  taskId: taskId ?? "",
                  photo: result.url,
                });
              }

              logger.log("ui", result.url);
              onClose();
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
