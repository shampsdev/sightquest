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
import { useAuthStore } from "@/shared/stores/auth.store";
import { AVATARS } from "@/constants";
import { useRef } from "react";
import { JoinBottomSheet } from "@/components/widgets/join-bottom-sheet";
import BottomSheet from "@gorhom/bottom-sheet";

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const location = useGeolocation();
  const { user } = useAuthStore();

  const account = () => {
    navigation.navigate("Account");
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View className="flex-1">
      <Map>
        {location && user && (
          <>
            <PlayerMarker
              coordinate={location}
              name={user?.name ?? user.username}
              avatarSrc={
                user.avatar
                  ? AVATARS.find((x) => x.id === Number(user.avatar))?.src
                  : AVATARS[0].src
              }
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

          {user && (
            <Pressable onPress={account}>
              <Avatar
                className="h-12 w-12"
                source={
                  user.avatar
                    ? AVATARS.find((x) => x.id === Number(user.avatar))?.src
                    : AVATARS[0].src
                }
              />
            </Pressable>
          )}
        </View>
      </View>

      <View className="absolute bottom-12 px-[5%] gap-2 flex flex-1 flex-row items-center">
        <Button
          onPress={() => bottomSheetRef.current?.snapToIndex(0)}
          className="flex-1 w-auto"
          text="Присоединится"
        />
        <Button className="flex-1 w-auto" text="Начать игру" />
      </View>

      <JoinBottomSheet ref={bottomSheetRef} />

      <StatusBar style="dark" />
    </View>
  );
};
