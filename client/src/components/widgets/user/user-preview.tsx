import { Avatar } from "@/components/ui/avatar";
import { Role } from "@/shared/interfaces/game/role";
import { ImageSourcePropType, View, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface UserPreviewProps {
  scores?: number;
  avatar: ImageSourcePropType;
  name: string;
  role: Role;
  active?: boolean;
}

export const UserPreview = ({
  scores,
  avatar,
  name,
  role,
  active,
}: UserPreviewProps) => {
  const styles =
    "flex flex-row gap-[21px] py-[20px] px-[28px] justify-between items-center rounded-[20px]";

  return (
    <View
      className={
        active ? twMerge(styles, " border-[2px] border-accent_primary") : styles
      }
    >
      <Avatar source={avatar} />
      <View className="flex flex-col flex-1 justify-start gap-[8px]">
        <Text className="text-text_primary font-bounded-regular text-[18px]">
          {name}
        </Text>
        <Text className="text-[#b6b6b6] font-onest-regular text-[16px]">
          {role == "catcher" ? "Догоняющий" : "Убегающий"}
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
