import Header from "@/components/ui/header";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import UserPreview from "@/components/widgets/user/user-preview";
import { AVATARS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Pressable, SafeAreaView, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HistoryRouteProp = RouteProp<MainStackParamList, "History">;

export const HistoryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const route = useRoute<HistoryRouteProp>();
  const insets = useSafeAreaInsets();
  const { gameId } = route.params;

  const back = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView
      className="flex-1 bg-bg_primary"
      style={{ paddingTop: insets.top || 20 }}
    >
      <ScrollView className="w-full">
        <View className="w-[90%] gap-[36px] relative mx-auto flex-col items-center">
          <View className="absolute w-full flex-row justify-between items-center">
            <Pressable onPress={back}>
              <IconContainer className="bg-[#222222]">
                <Icons.Back />
              </IconContainer>
            </Pressable>
          </View>

          <Header mainText={"Участники"} descriptionText={"Маршрут: A"} />

          <View className="flex flex-col w-full gap-[15px]">
            <UserPreview
              avatar={AVATARS[0].src}
              name={"aboba"}
              role={"Догоняющий"}
              scores={12}
            />
            <UserPreview
              avatar={AVATARS[0].src}
              name={"aboba"}
              role={"Догоняющий"}
              scores={12}
            />
            <UserPreview
              avatar={AVATARS[0].src}
              name={"aboba"}
              role={"Догоняющий"}
              scores={12}
            />
            <UserPreview
              avatar={AVATARS[0].src}
              name={"aboba"}
              role={"Догоняющий"}
              active
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
