import "./global.css";
import "react-native-reanimated";

import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { MainNavigator } from "./routers/main.navigator";
import { AuthNavigator } from "./routers/auth.navigator";
import { useAuthStore } from "./shared/stores/auth.store";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function App() {
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
  });

  const { auth } = useAuthStore();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {auth ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
