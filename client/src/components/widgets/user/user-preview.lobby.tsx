import { Avatar } from "@/components/ui/avatar";
import { Role } from "@/shared/interfaces/role";
import { ImageSourcePropType, View, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface UserLobbyPreviewProps {
  scores?: number;
  avatar: ImageSourcePropType;
  name: string;
  username: string;
  active?: boolean;
  className?: string;
}

export const UserLobbyPreview = ({
  scores,
  avatar,
  name,
  username,
  active,
  className,
}: UserLobbyPreviewProps) => {
  return (
    <View
      className={twMerge(
        "flex flex-row gap-[21px] py-[20px] px-[28px] justify-between items-center rounded-[20px]",
        active && "border-[2px] border-accent_primary",
        className
      )}
    >
      <Avatar source={avatar} />
      <View className="flex flex-col flex-1 justify-start gap-[8px]">
        <Text className="text-text_primary font-bounded-regular text-[18px]">
          {name}
        </Text>
        <Text className="text-[#b6b6b6] font-onest-regular text-[16px]">
          {`@${username}`}
        </Text>
      </View>

      <View className="flex flex-col gap-[1px] items-center justify-center">
        <Text className="text-text_primary font-bounded-regular text-[30px]">
          {scores}
        </Text>
      </View>
    </View>
  );
};
