import { Avatar } from "@/components/ui/avatar";
import { Role } from "@/shared/interfaces/Role";
import { ImageSourcePropType, View, Text } from "react-native";

interface UserPreviewProps {
  scores?: number;
  avatar: ImageSourcePropType;
  name: string;
  role: Role;
  active?: boolean;
}
const UserPreview = ({
  scores,
  avatar,
  name,
  role,
  active,
}: UserPreviewProps) => {
  const listStyle = active
    ? "flex flex-row gap-[21px] py-[20px] px-[28px] justify-between items-center rounded-[20px] border-[2px] border-accent_primary"
    : "flex flex-row gap-[21px] py-[20px] px-[28px] justify-between items-center rounded-[20px]";

  return (
    <View className={listStyle}>
      <Avatar source={avatar} />
      <View className="flex flex-col flex-1 justify-start gap-[8px]">
        <Text className="text-text_primary font-bounded-regular text-[18px]">
          {name}
        </Text>
        <Text className="text-[#b6b6b6] font-onest-regular text-[16px]">
          {role}
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

export default UserPreview;
