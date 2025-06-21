import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from "react-native";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
  source: ImageSourcePropType;
  className?: string;
  style?: StyleProp<ImageStyle>;
}

export const Avatar = ({ source, className, style }: AvatarProps) => {
  return (
    <Image
      className={twMerge("h-14 w-14 rounded-full", className)}
      source={source}
      resizeMode="cover"
      style={style}
    />
  );
};
