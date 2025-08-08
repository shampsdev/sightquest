import "react-native-reanimated";
import "./global.css";

import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthNavigator } from "./routers/auth.navigator";
import { MainNavigator } from "./routers/main.navigator";
import { useSocket } from "./shared/hooks/useSocket";
import { useAuthStore } from "./shared/stores/auth.store";
import { useGeolocationStore } from "./shared/stores/location.store";
import { logger } from "./shared/instances/logger.instance";
import React from "react";
import { View, Text } from "react-native";
import { ModalProvider } from "./shared/providers/modal-provider";
import { OverlayProvider } from "./shared/providers/overlay.provider";
import { SocketErrorModalBridge } from "./shared/instances/socket.instance";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const { startTracking, stopTracking } = useGeolocationStore();

  const [loaded, error] = useFonts({
    "Bounded-Black": require("./assets/fonts/Bounded-Black.ttf"),
    "Bounded-Bold": require("./assets/fonts/Bounded-Bold.ttf"),
    "Bounded-ExtraBold": require("./assets/fonts/Bounded-ExtraBold.ttf"),
    "Bounded-Light": require("./assets/fonts/Bounded-Light.ttf"),
    "Bounded-Medium": require("./assets/fonts/Bounded-Medium.ttf"),
    "Bounded-Regular": require("./assets/fonts/Bounded-Regular.ttf"),
    "Bounded-SemiBold": require("./assets/fonts/Bounded-SemiBold.ttf"),
    "Bounded-Thin": require("./assets/fonts/Bounded-Thin.ttf"),

    "Onest-Black": require("./assets/fonts/Onest-Black.ttf"),
    "Onest-Bold": require("./assets/fonts/Onest-Bold.ttf"),
    "Onest-ExtraBold": require("./assets/fonts/Onest-ExtraBold.ttf"),
    "Onest-ExtraLight": require("./assets/fonts/Onest-ExtraLight.ttf"),
    "Onest-Light": require("./assets/fonts/Onest-Light.ttf"),
    "Onest-Medium": require("./assets/fonts/Onest-Medium.ttf"),
    "Onest-Regular": require("./assets/fonts/Onest-Regular.ttf"),
    "Onest-SemiBold": require("./assets/fonts/Onest-SemiBold.ttf"),
    "Onest-Thin": require("./assets/fonts/Onest-Thin.ttf"),

    "Inter-Regular": require("./assets/fonts/Inter-Variable.ttf"),
  });

  const { auth, token } = useAuthStore();
  const { isConnected, emit } = useSocket();

  useEffect(() => {
    startTracking();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (token && isConnected) {
      emit("auth", { token });
    }
  }, [token, isConnected]);

  if (!loaded && !error) {
    return null;
  }

  class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
  > {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    componentDidCatch(err: any) {
      console.error("Unhandled UI error:", err);
    }
    render() {
      if (this.state.hasError) {
        return (
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <NavigationContainer>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 18, textAlign: "center" }}
                  >
                    Произошла ошибка. Приложение продолжает работу. Вернитесь
                    назад.
                  </Text>
                </View>
              </NavigationContainer>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        );
      }
      return this.props.children as any;
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer>
              <ModalProvider>
                <OverlayProvider>
                  <SocketErrorModalBridge />
                  {auth ? <MainNavigator /> : <AuthNavigator />}
                </OverlayProvider>
              </ModalProvider>
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
