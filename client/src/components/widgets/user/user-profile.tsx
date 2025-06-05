import { Avatar } from "@/components/ui/avatar";
import { AVATARS } from "@/constants";
import { ImageSourcePropType, View, Text } from "react-native";

interface UserProfileProps {
  avatar: ImageSourcePropType;
  name: string;
  username: string;
}

const UserProfile = ({ avatar, name, username }: UserProfileProps) => {
  return (
    <View className="flex flex-col gap-6 items-center justify-center">
      <Avatar source={avatar} className="w-[154px] h-[154px]" />
      <View className="flex flex-col gap-2 items-center">
        <Text className="font-bounded-regular text-text_primary text-[24px]">
          {name}
        </Text>
        <Text className="text-text_secondary font-onest-regular text-[16px]">
          {"@" + username}
        </Text>
      </View>
    </View>
  );
};

export default UserProfile;
