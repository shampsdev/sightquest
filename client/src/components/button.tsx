import { Pressable, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  className?: string;
  onPress?: () => void;
}

export const Button = ({ className, onPress }: ButtonProps) => {
  return (
    <Pressable
      className={twMerge(
        "w-96 h-16 bg-[#A163F5] active:bg-[#8d57f2] rounded-full justify-center items-center",
        className
      )}
      onPress={onPress}
    >
      <Text className="text-[#FFFF] text-lg font-semibold">Начать игру</Text>
    </Pressable>
  );
};
