import { Pressable, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "w-96 h-16 rounded-full justify-center items-center active:opacity-95",
  {
    variants: {
      variant: {
        default: "bg-accent_primary",
        disabled: "bg-navigation",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  onPress?: () => void;
  text: string;
  disabled?: boolean;
}

export const Button = ({
  className,
  onPress,
  text,
  variant,
  disabled = false,
}: ButtonProps) => {
  return (
    <Pressable
      className={twMerge(
        buttonVariants({ variant: disabled ? "disabled" : variant }),
        className
      )}
      onPress={disabled ? undefined : onPress}
    >
      <Text className="font-bounded-medium text-text_primary">{text}</Text>
    </Pressable>
  );
};
