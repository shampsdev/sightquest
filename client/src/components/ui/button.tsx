import { Pressable, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const button = {
  variant: {
    default: "bg-accent_primary",
    disabled: "bg-navigation",
    invisible: "",
  },
};

const buttonVariants = cva(
  "w-96 h-16 rounded-full justify-center items-center active:opacity-95",
  {
    variants: button,
    defaultVariants: {
      variant: "default",
    },
  }
);

const text = {
  variant: {
    default: "",
    disabled: "",
    invisible: "text-text_secondary",
  },
};

const textVariants = cva("font-bounded-medium text-text_primary", {
  variants: text,
  defaultVariants: {
    variant: "default",
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  onPress?: () => void;
  text: string;
  variant?: "default" | "disabled" | "invisible";
}

export const Button = ({ className, onPress, text, variant }: ButtonProps) => {
  return (
    <Pressable
      className={twMerge(buttonVariants({ variant }), className)}
      onPress={variant == "disabled" ? undefined : onPress}
    >
      <Text className={textVariants({ variant })}>{text}</Text>
    </Pressable>
  );
};
