import { NicknameType } from "@/shared/interfaces/nickname";
import { BlurView } from "expo-blur";
import { View, Text, StyleProp, ViewStyle } from "react-native";

interface NicknameProps {
  name: string;
  type: NicknameType;
}

export const Nickname = ({ type, name }: NicknameProps) => {
  switch (type) {
    case "default":
      return (
        <View className="rounded-full z-10 overflow-hidden">
          <BlurView
            intensity={10}
            tint="dark"
            className="px-2 py-1 rounded-full"
          >
            <Text className="font-onest-medium text-xs text-white">{name}</Text>
          </BlurView>
        </View>
      );
  }
};
