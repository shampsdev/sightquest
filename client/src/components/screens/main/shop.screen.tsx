import { Avatar } from "@/components/ui/avatar";
import { AvatarCardProps } from "@/components/widgets/avatar-card";
import { Button } from "@/components/ui/button";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import SectionPicker from "@/components/widgets/section-picker";
import AvatarsWidget from "@/components/widgets/shop/avatars";
import UserPreview from "@/components/widgets/user/user-preview";
import { AVATARS, SHOP_SECTIONS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useRef, useState } from "react";
import { View, Pressable, SafeAreaView, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoutesWidget, { RouteData } from "@/components/widgets/shop/routes";
import { Route } from "@/shared/interfaces/Route";
import Nicknames from "@/components/widgets/shop/nicknames";
import NicknamesWidget from "@/components/widgets/shop/nicknames";

export const ShopScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const insets = useSafeAreaInsets();
  const sectionRef = useRef<{ selectedSection: string }>({
    selectedSection: "Аватарки",
  });

  const [selectedSeciton, setSelectedSection] = useState<string>("Аватарки");

  const cards: AvatarCardProps[] = [
    {
      avatar: AVATARS[1].src,
      title: "Название",
      subtitle: "Описание",
      withButton: true,
      disabled: true,
    },
    {
      avatar: AVATARS[0].src,
      title: "Название",
      subtitle: "Описание",
      withButton: true,
      disabled: false,
    },
    {
      avatar: AVATARS[0].src,
      title: "Название",
      subtitle: "Описание",
      withButton: true,
      disabled: false,
    },
    {
      avatar: AVATARS[0].src,
      title: "Название",
      subtitle: "Описание",
      withButton: true,
      disabled: false,
    },
    {
      avatar: AVATARS[0].src,
      title: "Название",
      subtitle: "Описание",
      withButton: true,
      disabled: false,
    },
  ];

  const routes: RouteData[] = [
    {
      coords: { lon: 30.33018, lat: 59.945526 },
      route: "A",
      title: "ABOBA",
      disabled: true,
    },
    {
      coords: { lon: 30.33018, lat: 59.945526 },
      route: "A",
      title: "ABIBA",
    },
  ];

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
          <View className="flex flex-col items-center justify-center">
            <Text className="mx-auto text-text_primary text-[24px] font-bounded-regular">
              Магазин
            </Text>

            <Text className="mx-auto text-[16px] text-text_secondary font-bounded-regular">
              Все, чтобы бежать стильно
            </Text>
          </View>

          <View className="flex items-center justify-center">
            <SectionPicker
              options={[...SHOP_SECTIONS]}
              selectedRef={sectionRef}
              onChange={setSelectedSection}
            />
          </View>

          {sectionRef.current?.selectedSection === "Аватарки" && (
            <AvatarsWidget cards={cards} />
          )}

          {sectionRef.current?.selectedSection === "Маршруты" && (
            <RoutesWidget routes={routes} />
          )}
          {sectionRef.current?.selectedSection === "Ник" && (
            <NicknamesWidget cards={cards} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
