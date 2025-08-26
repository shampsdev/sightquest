import { Pressable, View, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { Icons } from './icons/icons';

interface CheckboxInputProps {
  className?: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxInput = ({
  className,
  label,
  checked,
  onChange,
  ...props
}: CheckboxInputProps) => {
  return (
    <Pressable
      className={twMerge("flex-row items-center", className)}
      onPress={() => onChange(!checked)}
      {...props}
    >
      <View
        className={twMerge(
          "h-6 w-6 rounded-lg border items-center justify-center",
          checked ? "bg-[#8d57f2] border-[#8d57f2]" : "border-[#292B2D]"
        )}
      >
        {checked && <Icons.Check />}
      </View>
      {label && <Text className="ml-3 text-lg text-text_primary">{label}</Text>}
    </Pressable>
  );
};
