import React from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

export class ErrorBoundary extends React.Component<
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
    return this.props.children;
  }
}
