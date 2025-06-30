import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { View, Pressable } from "react-native";
import { Map } from "@/components/widgets/map";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "@/routers/main.navigator";
import { Camera } from "@rnmapbox/maps";
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
import { useGeolocationStore } from "@/shared/stores/location.store";
import { useGameStore } from "@/shared/stores/game.store";
import { ReconnectNotification } from "@/components/ui/notifications/notification";
import { useGame } from "@/shared/api/hooks/useGame";
import { ModalCard } from "@/components/widgets/modal-card";
import { logger } from "@/shared/instances/logger.instance";

export const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const { location } = useGeolocationStore();
  const { user } = useAuthStore();
  const createGameMutation = useCreateGame();
  const { game: storedGame, setGame, resetChat } = useGameStore();
  const { data, isLoading, refetch, isError, error } = useGame(
    storedGame?.id || ""
  );

  const handleAccept = async () => {
    if (storedGame?.id && storedGame.state) {
      navigation.navigate("GameStack", { gameId: storedGame.id });
    } else if (!isLoading) {
      try {
        const result = await refetch();
        if (result.data) {
          setGame(result.data);
          navigation.navigate("GameStack", { gameId: storedGame?.id || "" });
        } else {
          logger.error("game", "Game data not found");
          setGame(null);
          resetChat();
        }
      } catch (err) {
        logger.error("game", "Error refetching game:");
        setGame(null);
        resetChat();
      }
    }
  };

  const createGameHandler = async () => {
    setGame(null);
    resetChat();
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

      <View className="absolute top-20 w-full flex flex-col gap-[16px]">
        <View className="w-[90%] mx-auto flex flex-row justify-between items-center">
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
        <View className="flex flex-col w-[90%] mx-auto">
          {storedGame?.id && (
            <ReconnectNotification
              id={storedGame.id}
              onAccept={handleAccept}
              onDecline={() => {
                setGame(null);
                resetChat();
              }}
            />
          )}
        </View>
      </View>
      {isError && !isLoading && (
        <ModalCard title="Уупс" subtitle={error.message} />
      )}
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
