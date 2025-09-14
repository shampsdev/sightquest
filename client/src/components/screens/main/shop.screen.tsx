import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { SectionPicker } from "@/components/widgets/section-picker";
import { AvatarsWidget } from "@/components/widgets/shop/avatars";
import { SHOP_SECTIONS } from "@/constants";
import { MainStackParamList } from "@/routers/main.navigator";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo, useRef, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { RoutesWidget } from "@/components/widgets/shop/routes";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/header";
import { StatusBar } from "expo-status-bar";
import { useStyles } from "@/shared/api/hooks/useStyles";
import { useAuthStore } from "@/shared/stores/auth.store";
import { setAvatar } from "@/shared/api/styles.api";
import { getMe } from "@/shared/api/auth.api";
import { Style } from "@/shared/interfaces/styles/styles";
import { useModal } from "@/shared/hooks/useModal";
import { logger } from "@/shared/instances/logger.instance";
import { useRoutes } from "@/shared/api/hooks/useRoutes";
import { WebView } from "react-native-webview";
import { buyRoute } from "@/shared/api/routes.api";
import { Route } from "@/shared/interfaces/route";

export const ShopScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const sectionRef = useRef<{ selectedSection: string }>({
    selectedSection: "Аватарки",
  });

  const [url, setUrl] = useState<null | string>(null);

  const [selectedSeciton, setSelectedSection] = useState<string>("Аватарки");

  const {
    data: avatars,
    isFetched: isAvatarsFetched,
    buyStyle,
    updateStyles,
  } = useStyles({
    type: "avatar",
  });

  const { data, isFetched, updateRoutes } = useRoutes();
  const routes = useMemo(
    () => (isFetched && data !== undefined ? data : []),
    [isFetched, data]
  );

  const { user, setUser } = useAuthStore();
  const { setModalOpen } = useModal();

  const back = () => {
    navigation.goBack();
  };

  const handleAvatarButton = async (avatar: Style) => {
    if (avatar.bought) {
      try {
        await setAvatar(avatar.id);
        const updatedUser = await getMe();
        setUser(updatedUser);
        setModalOpen({
          title: "Готово",
          subtitle: "Аватар обновлён",
          buttons: [
            { text: "Ок", type: "primary", onClick: () => setModalOpen(false) },
          ],
        });
      } catch (error) {
        logger.error("ui", "set avatar failed", error);
        setModalOpen({
          title: "Ошибка",
          subtitle: "Не удалось установить аватар",
          buttons: [
            {
              text: "Закрыть",
              type: "primary",
              onClick: () => setModalOpen(false),
            },
          ],
        });
      }
    } else {
      var result = await buyStyle(avatar.id);
      setUrl(result.confirmationUrl);
    }
  };

  const handleRouteButton = async (r: Route) => {
    var result = await buyRoute(r.id);
    setUrl(result.confirmationUrl);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg_primary">
      {url !== null ? (
        <WebView
          className="flex-1 w-full h-full"
          source={{ uri: url }}
          onNavigationStateChange={(state) => {
            if (state.url.includes("success")) {
              setUrl(null);

              updateStyles();
              updateRoutes();

              setModalOpen({
                title: "Спасибо за покупку!",
                subtitle:
                  "Покупка успешно завершена, можете применить аватар в магазине или найти маршрут в настройках лобби",
                buttons: [
                  {
                    text: "Ок",
                    type: "primary",
                    onClick: () => setModalOpen(false),
                  },
                ],
              });
            }
          }}
        />
      ) : (
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

            <View className="flex items-center justify-center pb-10">
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
                    buttonAction: async () => await handleAvatarButton(avatar),
                    subtitle:
                      avatar.priceRoubles == 0
                        ? "Бесплатно"
                        : `${avatar.priceRoubles} ₽`,
                    disabled: avatar.id === user?.styles?.avatarId,
                  }))}
                  className="pb-[70px]"
                />
              )}

            {sectionRef.current?.selectedSection === "Маршруты" && (
              <RoutesWidget
                routes={routes.filter(r => r.bought == false).map((r) => ({
                  route: r,
                  disabled: false,
                  buttonAction: async () => await handleRouteButton(r),
                }))}
              />
            )}
          </View>
        </ScrollView>
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
};
