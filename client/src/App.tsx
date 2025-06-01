import "./global.css";

import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { Map } from "./components/map";
import { Button } from "./components/button";
import { IconContainer } from "./components/icon-container";
import { Icons } from "./components/icons";

// TODO add routing

export default function App() {
  return (
    <View className="flex-1">
      <Map />
      <Button className="absolute right-0 left-0 bottom-8 m-8 w-auto" />
      <IconContainer className="absolute top-16 left-5">
        <Icons.Store />
      </IconContainer>
      <StatusBar style="auto" />
    </View>
  );
}
