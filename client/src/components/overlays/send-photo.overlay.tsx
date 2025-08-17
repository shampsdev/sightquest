import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Pressable, View, Image, Text } from "react-native";
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
import { CameraAction } from "./camera.overlay";
import { useOverlays } from "@/shared/hooks/useOverlays";
import { IconContainer } from "../ui/icons/icon-container";
import { Icons } from "../ui/icons/icons";
import { Avatar } from "../ui/avatar";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { hasAvatar } from "@/shared/interfaces/user";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SendPhotoOverlayProps {
  visible?: boolean;
  action?: CameraAction;
}

export const SendPhotoOverlay = ({
  visible,
  action,
}: SendPhotoOverlayProps) => {
  const insets = useSafeAreaInsets();
  const { emit } = useSocket();
  const { closeOverlay, openOverlay } = useOverlays();
  const { getStyle } = useStyles({ type: "avatar" });

  const opacity = useSharedValue(0);

  const onClose = () => {
    closeOverlay("sendPhoto");
  };

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
    action && (
      <Animated.View
        style={animatedStyle}
        className="absolute w-full mx-auto h-full z-30"
        pointerEvents={visible ? "auto" : "none"}
      >
        {/* Back button - same position as CameraOverlay */}
        <View className="absolute top-20 w-full z-40">
          <View className="w-[90%] mx-auto flex-row justify-between items-center">
            <Pressable
              onPress={() => {
                closeOverlay();
                openOverlay("camera", { action });
              }}
            >
              <IconContainer>
                <Icons.Back />
              </IconContainer>
            </Pressable>
          </View>
          <View className="w-full flex justify-center absolute top-0 left-0">
            <Text className="text-center pt-2 text-text_primary font-bounded-bold text-3xl">
              Результат
            </Text>
            <Text className="text-center text-text_secondary pt-4">
              Отправить фото на голосование?
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
            <View className="w-full relative aspect-square mx-auto rounded-[40px] z-10 overflow-hidden">
              <Image
                source={{ uri: action?.photo?.uri }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="cover"
              />
              {action.type === "catchPlayer" && (
                <>
                  <View className="absolute bottom-5 left-5 flex flex-row gap-2 rounded-full overflow-hidden">
                    <Avatar
                      className="z-20 m-[5px]"
                      source={{
                        uri:
                          hasAvatar(action.player.user) &&
                          getStyle(action.player.user.styles.avatarId)?.style
                            .url,
                      }}
                    ></Avatar>
                    <View className="flex flex-col justify-center z-20 py-2 pr-4">
                      <Text className="text-text_primary text-xl font-bounded-bold">
                        {action.player.user.name}
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
            </View>
          </View>

          <View className="h-[86px] w-full"></View>
        </View>

        <View
          className="absolute bottom-0 flex flex-row gap-[53px] items-center justify-center w-full z-40"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          <Button
            text="Отправить"
            className="w-fit px-12"
            onPress={async () => {
              const result = await uploadImageToS3(
                action.photo?.uri ?? "",
                undefined,
                "games"
              );
              if (action.type == "completeTask") {
                emit("taskComplete", {
                  taskId: action.taskId,
                  photo: result.url,
                  pollDuration: 30,
                });
              } else {
                emit("playerCatch", {
                  playerId: action.player.user.id ?? "",
                  photo: result.url,
                  pollDuration: 30,
                });
              }
              logger.log("ui", result.url);
              onClose();
            }}
          />
        </View>
      </Animated.View>
    )
  );
};
