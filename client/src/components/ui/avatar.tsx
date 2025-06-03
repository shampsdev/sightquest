import { Image, ImageSourcePropType } from "react-native";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
  source: ImageSourcePropType;
  className?: string;
}

export const Avatar = ({ source, className }: AvatarProps) => {
  return (
    <Image
      className={twMerge(
        "h-14 w-14 rounded-full",
        className
      )}
      source={source}
      resizeMode="cover"
    />
  );
};
