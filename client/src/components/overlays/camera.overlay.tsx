import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import {
  Pressable,
  View,
  ScrollView as ScrollViewType,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";
import { logger } from "@/shared/instances/logger.instance";
import { useCamera } from "@/shared/hooks/useCamera";
import { CameraView } from "expo-camera";

interface CameraOverlayProps {
  visible?: boolean;
  onClose: () => void;
  onSucces: () => void;
}

export const CameraOverlay = ({
  visible,
  onClose,
  onSucces,
}: CameraOverlayProps) => {
  const {
    cameraRef,
    permission,
    requestPermission,
    facing,
    toggleFacing,
    takePhoto,
  } = useCamera();

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

  if (!permission) {
    return <View />;
  }
  return (
    <Animated.View
      style={animatedStyle}
      className="absolute w-full mx-auto h-full z-30"
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
          {!permission.granted && (
            <Button
              text={"Дать разрешение на использование камеры"}
              onPress={requestPermission}
            />
          )}
          <View className=" h-[360px] mx-auto rounded-[16px] z-10 overflow-hidden">
            {permission.granted && visible && (
              <CameraView
                style={styles.camera}
                ref={cameraRef}
                facing={facing}
              />
            )}
          </View>
        </View>

        <View className="flex flex-row gap-[53px] pb-12 items-center justify-center w-full">
          <Pressable onPress={() => {}} className="opacity-0">
            <IconContainer className="bg-accent_primary">
              <Icons.Camera />
            </IconContainer>
          </Pressable>
          <Pressable
            onPress={async () => {
              try {
                const photo = await takePhoto();
                onSucces();
              } catch (error) {
                logger.error("ui", "Error taking photo");
              }
            }}
          >
            <IconContainer className="bg-accent_primary border-[3px] border-[#FFF] w-[86px] h-[86px]">
              <Icons.TakePhoto />
            </IconContainer>
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <IconContainer className="bg-primary p-[13px]">
              <Icons.Revert />
            </IconContainer>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: 360,
    height: 360,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
