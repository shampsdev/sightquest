import "./global.css";

import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Map } from "./components/map";

export default function App() {
  return (
    <View className="flex-1">
      <Map />
      <StatusBar style="auto" />
    </View>
  );
}
