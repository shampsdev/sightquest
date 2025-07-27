import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { PlayerMessageBlock } from "@/components/widgets/player-message-block";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useSocket } from "@/shared/hooks/useSocket";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGameStore } from "@/shared/stores/game.store";
import { BlurView } from "expo-blur";
import React, { useState, useRef, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ScrollView as ScrollViewType,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

export interface ChatOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export const ChatOverlay = ({ visible, onClose }: ChatOverlayProps) => {
  const { emit } = useSocket();
  const [message, setMessage] = useState("");

  const { data: avatars } = useStyles({ type: "avatar" });
  const { chatMessages, game, setUndreadMessages } = useGameStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setUndreadMessages(false);
  }, [chatMessages]);

  const scrollViewRef = useRef<ScrollViewType>(null);

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

  const sendMessage = () => {
    if (message.trim()) {
      emit("broadcast", {
        data: message,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

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
          "py-[40px] px-[36px] h-[85%] flex-1 rounded-[30px] w-full z-30 flex flex-col justify-end gap-8"
        )}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            gap: 24,
            paddingBottom: 10,
          }}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.map((messageGroup, index) => (
            <PlayerMessageBlock
              key={index}
              nickname={
                messageGroup.playerId !== user?.id
                  ? game?.players.find(
                      (player) => player.user.id === messageGroup.playerId
                    )?.user.name ?? ""
                  : undefined
              }
              avatar={{
                uri: avatars?.find(
                  (x) =>
                    x.id ===
                    game?.players.find(
                      (player) => player.user.id === messageGroup.playerId
                    )?.user.styles?.avatarId
                )?.style.url,
              }}
              messages={messageGroup.messages}
              alignRight={messageGroup.playerId === user?.id}
            />
          ))}
        </ScrollView>

        <View className="flex flex-row gap-[10px] pb-12 items-center justify-center w-full">
          <TextInput
            className={twMerge(
              "rounded-full flex-1 border-text_secondary border-[1px] text-[16px] text-[#B6B6B6]  px-[20px]",
              Platform.OS === "ios" ? "py-[15px]" : ""
            )}
            placeholder="Сообщение..."
            placeholderTextColor="#B6B6B6"
            value={message}
            onChangeText={setMessage}
          />
          <Pressable onPress={sendMessage}>
            <IconContainer className="bg-accent_primary">
              <Icons.Send />
            </IconContainer>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
