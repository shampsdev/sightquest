import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PixelRatio,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Camera } from "@rnmapbox/maps";

import { Map } from "@/components/widgets/map";
import { IconContainer } from "@/components/ui/icons/icon-container";
import { Icons } from "@/components/ui/icons/icons";
import { Button } from "@/components/ui/button";

import { DEFAULT_MAP_CAMERA_LOCATION } from "@/constants";
import { GameStackParamList } from "@/routers/game.navigator";
import { Route } from "@/shared/interfaces/route";
import { logger } from "@/shared/instances/logger.instance";
import { RouteMarker } from "@/components/ui/map/route-marker";
import { useSocket } from "@/shared/hooks/useSocket";
import { useGameStore } from "@/shared/stores/game.store";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useRoutes } from "@/shared/api/hooks/useRoutes";
import { PlaceMarker } from "@/components/ui/map/place-marker";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = PixelRatio.roundToNearestPixel(SCREEN_WIDTH * 0.9);
const SIDE_GUTTER = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const CARD_SPACING = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

const RouteCard = ({ item }: { item: Route }) => (
  <View
    style={{ width: CARD_WIDTH }}
    className="h-fit bg-navigation rounded-3xl p-5 justify-between"
  >
    <Text className="text-xl font-bounded-semibold text-text_primary">
      {item.title}
    </Text>
    <Text className="flex-1 my-2 text-text_secondary">{item.description}</Text>
  </View>
);

const toLonLat = (r: Route): [number, number][] =>
  r.taskPoints.map((tp) => [tp.location.lon, tp.location.lat]);

export const RouteScreen = () => {
  const navigation = useNavigation<StackNavigationProp<GameStackParamList>>();
  const insets = useSafeAreaInsets();
  const { emit } = useSocket();

  const { game } = useGameStore();
  const { user } = useAuthStore();

  const { data, isFetched } = useRoutes();
  const routes = useMemo(
    () => (isFetched && data !== undefined ? data : []),
    [isFetched, data]
  );

  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList<Route>>(null);
  const scrollIndexRef = useRef(0);

  const back = () => navigation.goBack();

  const selected = useMemo(() => routes[index], [index]);

  const choose = useCallback(() => {
    emit("setRoute", { routeId: selected.id });
    back();
    logger.log("ui", `selected route with id ${selected.id}`);
  }, [index, routes]);

  const cameraRef = useRef<Camera>(null);

  const fitToPoints = useCallback((points: [number, number][]) => {
    if (!cameraRef.current || points.length === 0) return;

    if (points.length === 1) {
      cameraRef.current.moveTo(points[0], 300);
      return;
    }

    const lats = points.map(([, lat]) => lat);
    const lons = points.map(([lon]) => lon);

    const southWest: [number, number] = [Math.min(...lons), Math.min(...lats)];
    const northEast: [number, number] = [Math.max(...lons), Math.max(...lats)];

    cameraRef.current.fitBounds(northEast, southWest, 40, 300);
  }, []);

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const raw = nativeEvent.contentOffset.x / SNAP_INTERVAL;
      const nextIndex = Math.round(raw);

      if (
        nextIndex !== scrollIndexRef.current &&
        nextIndex >= 0 &&
        nextIndex < routes.length
      ) {
        scrollIndexRef.current = nextIndex;
        fitToPoints(toLonLat(routes[nextIndex]));
        setIndex(nextIndex);
      }
    },
    [routes, fitToPoints]
  );

  useEffect(() => {
    if (routes.length > 0) fitToPoints(toLonLat(routes[0]));
  }, [routes]);

  return (
    <View className="flex-1">
      <View
        style={{ top: insets.top }}
        className="absolute z-20 w-full flex flex-col gap-4"
      >
        <View className="w-[90%] mx-auto flex-row justify-between items-center">
          <Pressable onPress={back}>
            <IconContainer>
              <Icons.Back />
            </IconContainer>
          </Pressable>

          <IconContainer className="w-auto px-5">
            <Text className="text-text_primary text-sm font-bounded-medium">
              Выбор маршрута
            </Text>
          </IconContainer>

          <IconContainer className="bg-transparent" />
        </View>
      </View>

      <Map>
        {routes.map((x) => (
          <RouteMarker
            key={`route_marker_${x.id}`}
            shapes={x.taskPoints.map((point) => (
              <PlaceMarker
                key={point.id}
                coordinate={[point.location.lon, point.location.lat]}
              />
            ))}
            path={x.taskPoints}
            routeId={x.id}
          ></RouteMarker>
        ))}

        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: routes[0]?.taskPoints[0]
              ? [
                  routes[0].taskPoints[0].location.lon,
                  routes[0].taskPoints[0].location.lat,
                ]
              : DEFAULT_MAP_CAMERA_LOCATION,
            zoomLevel: 12,
          }}
        />
      </Map>

      <View
        className="absolute left-0 right-0 z-50"
        style={{ bottom: Math.max(insets.bottom, 12) }}
      >
        <FlatList
          ref={flatListRef}
          data={routes}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          contentContainerStyle={{ paddingHorizontal: SIDE_GUTTER }}
          contentInset={{
            left: SIDE_GUTTER,
            right: SIDE_GUTTER,
          }}
          ItemSeparatorComponent={() => (
            <View style={{ width: CARD_SPACING }} />
          )}
          decelerationRate="fast"
          onScroll={onScroll}
          renderItem={(props: ListRenderItemInfo<Route>) => (
            <RouteCard item={props.item} />
          )}
        />

        {game && game.admin.id === user?.id ? (
          <Button
            onPress={choose}
            className="mt-4 flex-1 w-[90%] mx-auto "
            text="Выбрать"
            variant={routes.length === 0 ? "disabled" : "default"}
          />
        ) : (
          <Button
            className="mt-4 flex-1 w-[90%] mx-auto bg-accent_secondary"
            text={game?.route?.id == selected.id ? "Выбран" : "Выбрать"}
            variant={"disabled"}
          />
        )}
      </View>
    </View>
  );
};
