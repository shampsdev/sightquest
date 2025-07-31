import { View, Text, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

interface ReconnectNotificationProps {
  id: string;
  onAccept: () => void;
  onDecline: () => void;
  className?: string;
}

export const ReconnectNotification = ({
  id,
  onAccept,
  onDecline,
  className,
}: ReconnectNotificationProps) => {
  return (
    <View
      className={twMerge(
        "relative flex flex-row items-center gap-2.5 py-4 px-4 rounded-[20px] overflow-hidden",
        className
      )}
    >
      <BlurView
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 10,
        }}
        
        tint="dark"
        intensity={90}
      />
      <View
        className="bg-bg_secondary"
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 20,
        }}
      />

      <View className="flex w-[33%] flex-col items-center gap-0 justify-center z-10">
        <Text className="font-bounded-semibold text-[24px] text-text_primary">
          {id.slice(0, id.length / 2)}
        </Text>
        <Text className="font-bounded-semibold text-[24px] text-text_primary">
          {id.slice(id.length / 2, id.length)}
        </Text>
      </View>
      <View className="flex flex-col align-start z-10">
        <Text className="font-onest-regular text-[14px] text-[#B6B6B6]">
          Вы отключились от игры
        </Text>
        <Pressable onPress={onDecline}>
          <Text className="font-bounded-semibold text-[18px] text-text_primary">
            Отклонить
          </Text>
        </Pressable>
        <Pressable onPress={onAccept}>
          <View className="bg-primary">
            <Text className="font-bounded-semibold text-[18px] text-text_primary">
              Вернуться
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
