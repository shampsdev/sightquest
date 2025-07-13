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
import { Button } from "../ui/button";
import { uploadImageToS3 } from "@/shared/api/s3.api";
import { logger } from "@/shared/instances/logger.instance";
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
          "py-[40px] px-[36px] h-[85%] mb-[80px] mx-auto flex-1 rounded-[30px] w-full z-30 flex flex-col justify-end gap-16"
        )}
      >
        <View className="flex flex-col w-full justify-center mx-auto">
          <View className="w-full aspect-square mx-auto rounded-[16px] overflow-hidden">
            <Image
              source={{ uri: photo?.uri }}
              style={{
                width: "100%",
                height: "100%",
              }}
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
              emit("taskComplete", {
                taskId: taskId ?? "",
                photo: result.url,
                pollDuration: 10,
              });
              logger.log("ui", result.url);
              onClose();
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
