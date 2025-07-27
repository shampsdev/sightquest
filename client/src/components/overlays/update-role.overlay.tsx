import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import {
  Pressable,
  View,
  Platform,
  KeyboardAvoidingView,
  Image,
  Text,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import { AvatarCard } from "../widgets/avatar-card";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { Player } from "@/shared/interfaces/game/player";
import { useOverlays } from '@/shared/hooks/useOverlays';

export interface UpdateRoleOverlayProps {
  visible?: boolean;
  player: Player;
}

export const UpdateRoleOverlay = ({
  visible,
  player,
}: UpdateRoleOverlayProps) => {
  const { closeOverlay } = useOverlays();

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

  const { data: avatars } = useStyles({ type: "avatar" });

  const onClose = () => {
    closeOverlay("updateRole");
  };

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
          <View>
            <Text>Новый убегающий!</Text>
            <View>
              <Text>Голосование завершено!</Text>
              <Text>Назначена новая цель</Text>
            </View>
          </View>
          <AvatarCard
            avatar={
              avatars?.find((x) => x.id === player?.user.styles?.avatarId)
                ?.style.url
            }
            title={player?.user.name ?? ""}
            subtitle={`@${player?.user.id}`}
          />
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
