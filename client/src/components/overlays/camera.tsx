import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { useSocket } from "@/shared/hooks/useSocket";
import { BlurView } from "expo-blur";
import React, { useRef, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
  ScrollView as ScrollViewType,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button } from "../ui/button";
import { logger } from "@/shared/instances/logger.instance";

interface CameraOverlayProps {
  visible?: boolean;
  onClose: () => void;
}

export const CameraOverlay = ({ visible, onClose }: CameraOverlayProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");

  const { emit } = useSocket();

  const scrollViewRef = useRef<ScrollViewType>(null);

  const opacity = useSharedValue(0);

  const ref = useRef<CameraView>(null);

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
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

  if (!permission) {
    return <View />;
  }
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
          "py-[40px] px-[36px] h-[85%] flex-1 rounded-[30px] w-full z-30 flex flex-col justify-center gap-16"
        )}
      >
        <View className="flex flex-col justify-start">
          {!permission.granted && (
            <Button
              text={"Дать разрешение на использование камеры"}
              onPress={requestPermission}
            />
          )}
          <View className="w-[360px] h-[360px] rounded-[16px] overflow-hidden">
            {permission.granted && (
              <CameraView style={styles.camera} ref={ref} facing={facing} />
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
              logger.log("ui", "pressed");
              const photo = await ref.current?.takePictureAsync();
              logger.log("ui", "unpressed");
              logger.log("ui", photo?.uri);
            }}
          >
            <IconContainer className="bg-accent_primary border-[3px] border-[#FFF] w-[86px] h-[86px]">
              <Icons.TakePhoto />
            </IconContainer>
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <IconContainer className="bg-accent_primary">
              <Icons.Camera />
            </IconContainer>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    zIndex: 1000,
    flex: 1,
    width: 360,
    height: 360,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
