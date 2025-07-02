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
import { View, Pressable, ScrollView } from "react-native";
import { RoutesWidget, RouteData } from "@/components/widgets/shop/routes";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/header";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useAuthStore } from "@/shared/stores/auth.store";
import { setAvatar } from "@/shared/api/styles.api";
import { getMe } from "@/shared/api/auth.api";
import { Style } from "@/shared/interfaces/styles/styles";

export const ShopScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const sectionRef = useRef<{ selectedSection: string }>({
    selectedSection: "Аватарки",
  });

  const insets = useSafeAreaInsets();

  const [selectedSeciton, setSelectedSection] = useState<string>("Аватарки");

  const {
    data: avatars,
    isFetched: isAvatarsFetched,
    buyStyle,
  } = useStyles({
    type: "avatar",
  });

  const routes: RouteData[] = [
    {
      coords: { lon: 30.33018, lat: 59.945526 },
      route: {
        id: "",
        title: "Kletka",
        description: "",
        priceRoubles: 0,
        taskPoints: [],
      },
      disabled: true,
    },
    {
      coords: { lon: 30.33018, lat: 59.945526 },
      route: {
        id: "",
        title: "Peter I",
        description: "",
        priceRoubles: 0,
        taskPoints: [],
      },
    },
  ];

  const { user, setUser } = useAuthStore();

  const back = () => {
    navigation.goBack();
  };

  const handleButton = async (avatar: Style) => {
    if (avatar.bought) {
      try {
        await setAvatar(avatar.id);
        const updatedUser = await getMe();
        setUser(updatedUser);
      } catch (error) {
        alert("Произошла ошибка при установке аватара");
      }
    } else {
      await buyStyle(avatar.id);
    }
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

          {sectionRef.current?.selectedSection === "Аватарки" &&
            isAvatarsFetched && (
              <AvatarsWidget
                cards={avatars!.map((avatar) => ({
                  avatar: avatar.style.url,
                  title: avatar.title,
                  withButton: true,
                  bought: avatar.bought,
                  buttonAction: async () => {
                    await handleButton(avatar);
                  },
                  subtitle: String(avatar.priceRoubles),
                  disabled: avatar.id === user?.styles?.avatarId,
                }))}
                className="pb-[70px]"
              />
            )}

          {sectionRef.current?.selectedSection === "Маршруты" && (
            <RoutesWidget routes={routes} />
          )}
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
