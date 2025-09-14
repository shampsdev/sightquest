import { View, Text, Animated, Easing } from "react-native";
import { BlurView } from "expo-blur";
import { twMerge } from "tailwind-merge";
import { useEffect, useRef } from "react";
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

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const ModalCard = ({
  className,
  title,
  subtitle,
  buttons,
}: ModalCardProps) => {
  const blurAnim = useRef(new Animated.Value(0)).current; // for blur intensity
  const scaleAnim = useRef(new Animated.Value(0.95)).current; // for modal scale

  useEffect(() => {
    Animated.parallel([
      Animated.timing(blurAnim, {
        toValue: 80, // final blur intensity
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false, // must be false for blur intensity
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="absolute w-full h-full z-20 flex justify-center items-center">
      {/* Animated Blur */}
      <AnimatedBlurView
        intensity={blurAnim}
        tint="dark"
        className="absolute w-full h-full"
      />

      {/* Animated Modal */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
        className={twMerge(
          "bg-[#FFF] pt-[40px] pb-[20px] px-[36px] rounded-[30px] w-[90%] flex flex-col justify-center items-center gap-8",
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
      </Animated.View>
    </View>
  );
};
