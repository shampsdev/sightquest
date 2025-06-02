import { IconContainer } from "@/components/ui/Icon/icon-container";
import { Icons } from "@/components/ui/Icon/icons";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Map } from "@/components/widgets/map";
import { Button } from "@/components/ui/Button/button";

const MapScreen = () => {
  return (
    <View className="flex-1">
      <Map />
      <Button
        className="absolute right-0 left-0 bottom-8 m-8 w-auto"
        text="Начать игру"
      />
      <IconContainer className="absolute top-16 left-5">
        <Icons.Store />
      </IconContainer>
      <StatusBar style="auto" />
    </View>
  );
};

export default MapScreen;
