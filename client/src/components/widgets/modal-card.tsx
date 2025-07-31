import { View, Text, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";

interface ModalOption {
  text: string;
  type: "primary" | "secondary";
  onClick: () => void;
}

export interface ModalCardProps {
  className?: string;
  title: string;
  subtitle: string;
  buttons: [ModalOption] | [ModalOption, ModalOption];
}

export const ModalCard = ({
  className,
  title,
  subtitle,
  buttons,
}: ModalCardProps) => {
  return (
    <View className="absolute w-full h-full z-20 flex justify-center items-center">
      <BlurView
        
        intensity={80}
        tint="dark"
        className="absolute w-full h-full"
      />
      <View
        className={twMerge(
          "bg-[#FFF] pt-[40px] pb-[20px] px-[36px]  rounded-[30px] w-[90%] flex flex-col justify-center items-center gap-8",
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
          {buttons.map((btn, index) => (
            <Button
              key={`modal_button_${index}`}
              text={btn.text}
              className={
                btn.type == "primary"
                  ? "w-[200px] px-[57px] py-[19px] mx-auto"
                  : "font-bounded-regular text-text_secondary"
              }
              variant={btn.type == "primary" ? "default" : "invisible"}
              onPress={btn.onClick}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
