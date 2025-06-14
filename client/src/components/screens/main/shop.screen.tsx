import { AvatarCardProps } from "@/components/widgets/avatar-card";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { SectionPicker } from "@/components/widgets/section-picker";
import { AvatarsWidget } from "@/components/widgets/shop/avatars";
import { AVATARS, SHOP_SECTIONS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRef, useState } from "react";
import { View, Pressable, SafeAreaView, ScrollView } from "react-native";
import { RoutesWidget, RouteData } from "@/components/widgets/shop/routes";
import { NicknamesWidget } from "@/components/widgets/shop/nicknames";
import { Header } from "@/components/ui/header";
import { StatusBar } from 'expo-status-bar';

export const ShopScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
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
    <SafeAreaView className="flex-1 bg-bg_primary">
      <ScrollView className="w-full">
        <View className="w-[90%] gap-[36px] relative mx-auto flex-col items-center">
          <View className="absolute w-full flex-row justify-between items-center">
            <Pressable onPress={back}>
              <IconContainer className="bg-[#222222]">
                <Icons.Back />
              </IconContainer>
            </Pressable>
          </View>

          <Header
            mainText={"Магазин"}
            descriptionText={"Все, чтобы бежать стильно"}
          />

          <View className="flex items-center justify-center">
            <SectionPicker
              options={[...SHOP_SECTIONS]}
              selectedRef={sectionRef}
              onChange={setSelectedSection}
            />
          </View>

          {sectionRef.current?.selectedSection === "Аватарки" && (
            <AvatarsWidget cards={cards} className="pb-[70px]" />
          )}

          {sectionRef.current?.selectedSection === "Маршруты" && (
            <RoutesWidget routes={routes} />
          )}
          {sectionRef.current?.selectedSection === "Ник" && (
            <NicknamesWidget cards={cards} className="pb-[70px]" />
          )}
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
