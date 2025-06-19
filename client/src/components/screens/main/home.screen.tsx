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
import { useEffect, useRef } from "react";
import { JoinBottomSheet } from "@/components/widgets/join-bottom-sheet";
import { useCreateGame } from "@/shared/api/hooks/useCreateGame";
import BottomSheet from "@gorhom/bottom-sheet";
import { useStyles } from "@/shared/api/hooks/useStyles";
import React from "react";
import { useGameStore } from "@/shared/stores/game.store";

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const location = useGeolocation();
  const { user } = useAuthStore();
  const createGameMutation = useCreateGame();

  const { game, setGame } = useGameStore();

  const createGameHandler = async () => {
    const game = await createGameMutation.mutateAsync();
    navigation.navigate("GameStack", {
      gameId: game.id,
    });
  };

  const joinHandler = async (id: string) => {
    navigation.navigate("GameStack", { gameId: id });
  };

  const account = () => {
    navigation.navigate("Account");
  };

  const shop = () => {
    navigation.navigate("Shop");
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { data: avatars } = useStyles({ type: "avatar", bought: true });

  return (
    <View className="flex-1">
      <Map>
        {location && user && (
          <>
            <PlayerMarker
              coordinate={{ lon: location[0], lat: location[1] }}
              name={user?.name ?? user.username}
              avatarSrc={{
                uri: avatars?.find((x) => x.id === user.styles?.avatarId)?.style
                  .url,
              }}
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
          <Pressable onPress={shop}>
            <IconContainer>
              <Icons.Store />
            </IconContainer>
          </Pressable>

          {user && (
            <Pressable onPress={account}>
              <Avatar
                className="h-12 w-12"
                source={{
                  uri: avatars?.find((x) => x.id === user.styles?.avatarId)
                    ?.style.url,
                }}
              />
            </Pressable>
          )}
        </View>
      </View>

      <View className="absolute bottom-12 px-[5%] gap-2 flex flex-1 flex-row items-center">
        <Button
          onPress={() => bottomSheetRef.current?.snapToIndex(0)}
          className="flex-1 w-auto"
          text="Присоединиться"
        />
        <Button
          className="flex-1 w-auto"
          text="Начать игру"
          onPress={() => createGameHandler()}
        />
      </View>

      <JoinBottomSheet
        ref={bottomSheetRef}
        handleJoin={joinHandler}
        children={undefined}
      />

      <StatusBar style="dark" />
    </View>
  );
};
