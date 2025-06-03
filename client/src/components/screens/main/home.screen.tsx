import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { View, Pressable } from "react-native";
import { Map } from "@/components/widgets/map";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "@/routers/main.navigator";
import { Camera } from "@rnmapbox/maps";
import { useGeolocation } from "@/shared/hooks/useGeolocation";

import { PlayerMarker } from "@/components/ui/map/player-marker";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "@/components/ui/avatar";
import { RouteMarker } from "@/components/ui/map/route-marker";

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const location = useGeolocation();

  const account = () => {
    navigation.navigate("Account");
  };

  return (
    <View className="flex-1">
      <Map>
        {location && (
          <>
            <PlayerMarker
              coordinate={location}
              name="Мишель"
              avatarSrc={require("@/assets/avatars/avatar-14.png")}
            />
            <Camera
              defaultSettings={{
                centerCoordinate: location,
                zoomLevel: 15,
              }}
            />
          </>
        )}

        <RouteMarker
          points={[
            [30.322951, 59.943216],
            [30.3241, 59.9532],
          ]}
          path={[
            [30.318977, 59.94153],
            [30.326345, 59.944563],
            [30.33018, 59.945526],
            [30.323688, 59.953183],
            [30.333407, 59.957705],
            [30.344544, 59.958102],
          ]}
        />
      </Map>

      <View className="absolute top-20 w-full">
        <View className="w-[90%] mx-auto flex-row justify-between items-center">
          <IconContainer>
            <Icons.Store />
          </IconContainer>

          <Pressable onPress={account}>
            <Avatar
              className="h-12 w-12"
              source={require("@/assets/avatars/avatar-14.png")}
            />
          </Pressable>
        </View>
      </View>

      <View className="absolute bottom-12 w-full items-center">
        <Button className="w-[90%]" text="Начать игру" />
      </View>

      <StatusBar style="dark" />
    </View>
  );
};
