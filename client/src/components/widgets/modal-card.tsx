import { View, Text, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";

const Z = () => {
  return <Text>Goida</Text>;
};

const O = () => {
  return <Text>Bratya</Text>;
};

const V = () => {
  return <Text>I SESTRIII</Text>;
};

export interface ModalCardProps {
  className?: string;
  title: string;
  subtitle: string;
  confirmText?: string;
  rejectText?: string;
  onConfirm?: () => void;
  onReject?: () => void;
}

export const ModalCard = ({
  className,
  title,
  subtitle,
  confirmText,
  rejectText,
  onConfirm,
  onReject,
}: ModalCardProps) => {
  return (
    <View className="absolute w-full h-full z-20 flex justify-center items-center">
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={80}
        tint="dark"
        className="absolute w-full h-full"
      />
      <View
        className={twMerge(
          "bg-[#FFF] py-[40px] px-[36px]  rounded-[30px] w-[90%]  flex flex-col justify-center items-center gap-8",
          className
        )}
      >
        <View className="flex flex-col gap-4 items-center">
          {title && (
            <Text className="text-text_quaternary text-[24px] font-bounded-regular text-center">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="font-onest-regular text-[16px] text-text_secondary text-center">
              {subtitle}
            </Text>
          )}
        </View>
        <View className="flex flex-col gap-[20px] justify-center ">
          {confirmText && (
            <Button
              text={confirmText}
              onPress={onConfirm}
              className="w-fit px-[57px] py-[19px]"
            />
          )}
          {rejectText && (
            <Pressable onPress={onReject}>
              <View className="items-center">
                <Text className="font-bounded-regular text-text_secondary">
                  {rejectText}
                </Text>
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};
