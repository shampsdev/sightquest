import React, { useCallback, useEffect, useRef, useState } from "react";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = PixelRatio.roundToNearestPixel(SCREEN_WIDTH * 0.9);
const SIDE_GUTTER = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const CARD_SPACING = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

export const mockRoutes: Route[] = [
  {
    id: "route-kremlin-walk",
    title: "Прогулка по Кремлю",
    description:
      "Блиц-маршрут по сердце столицы: стены Кремля, Иван-великий, Соборная площадь.",
    priceRoubles: 250,
    taskPoints: [
      {
        id: "tp-spasskaya-tower",
        title: "Спасская башня",
        description:
          "Сфотографируйте куранты и узнайте время до следующего часа.",
        location: { lat: 55.752664, lon: 37.623944 },
        score: 100,
        task: "Фото-задание",
      },
      {
        id: "tp-ivan-bell",
        title: "Колокольня Ивана Великого",
        description: "Сосчитайте количество ярусов колокольни.",
        location: { lat: 55.750916, lon: 37.618421 },
        score: 150,
        task: "Викторина",
      },
      {
        id: "tp-tsar-cannon",
        title: "Царь-пушка",
        description: "Ответьте, сколько тонн весит ядро перед пушкой.",
        location: { lat: 55.75038, lon: 37.620793 },
        score: 120,
        task: "Вопрос-ответ",
      },
      {
        id: "tp-tsar-bell",
        title: "Царь-колокол",
        description: "Найдите и покажите трещину на колоколе.",
        location: { lat: 55.750096, lon: 37.621911 },
        score: 130,
        task: "Фото-задание",
      },
    ],
  },

  {
    id: "route-arbat-adventure",
    title: "Приключения на Арбате",
    description:
      "Художники, уличные музыканты и тайные дворики старого Арбата.",
    priceRoubles: 300,
    taskPoints: [
      {
        id: "tp-arbat-wall",
        title: "Стена Цоя",
        description:
          "Найдите свежий граффити-портрет Виктора и сфотографируйте.",
        location: { lat: 55.747871, lon: 37.592611 },
        score: 120,
        task: "Фото-задание",
      },
      {
        id: "tp-vakhtangov",
        title: "Театр им. Вахтангова",
        description: "Как зовут бронзовую статую перед входом?",
        location: { lat: 55.748851, lon: 37.593998 },
        score: 140,
        task: "Вопрос-ответ",
      },
      {
        id: "tp-old-arbat-yard",
        title: "Староарбатский дворик",
        description: "Найдите барельеф с котом и сделайте селфи.",
        location: { lat: 55.748193, lon: 37.595771 },
        score: 160,
        task: "Фото-задание",
      },
    ],
  },

  {
    id: "route-sparrow-hills-quest",
    title: "Квест на Воробьёвых горах",
    description: "Панорамы Москвы, канатная дорога и тайны МГУ.",
    priceRoubles: 400,
    taskPoints: [
      {
        id: "tp-msu-main",
        title: "Главное здание МГУ",
        description: "Сколько этажей насчитывает центральная башня?",
        location: { lat: 55.703145, lon: 37.530126 },
        score: 150,
        task: "Викторина",
      },
      {
        id: "tp-view-platform",
        title: "Смотровая площадка",
        description: "Сделайте панорамное фото видовой площадки.",
        location: { lat: 55.710182, lon: 37.554574 },
        score: 180,
        task: "Фото-задание",
      },
      {
        id: "tp-ski-slope",
        title: "Лыжный спуск",
        description: "Найдите подъёмник и подсчитайте количество кабин.",
        location: { lat: 55.712315, lon: 37.554155 },
        score: 120,
        task: "Подсчёт",
      },
      {
        id: "tp-cable-station",
        title: "Канатная дорога",
        description:
          "Запишите время пути от станции «Воробьёвы горы» до «Лужников».",
        location: { lat: 55.710334, lon: 37.558702 },
        score: 150,
        task: "Измерение",
      },
    ],
  },
];

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

const toLngLat = (r: Route): [number, number][] =>
  r.taskPoints.map((tp) => [tp.location.lon, tp.location.lat]);

export const RouteScreen = () => {
  const navigation = useNavigation<StackNavigationProp<GameStackParamList>>();
  const insets = useSafeAreaInsets();
  const { emit } = useSocket();

  const { game } = useGameStore();
  const { user } = useAuthStore();
  const routes = mockRoutes;

  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList<Route>>(null);
  const scrollIndexRef = useRef(0);

  const back = () => navigation.goBack();

  const choose = useCallback(() => {
    const selected = routes[index];

    // emit select route / settings update
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
        fitToPoints(toLngLat(routes[nextIndex]));
        setIndex(nextIndex);
      }
    },
    [routes, fitToPoints]
  );

  useEffect(() => {
    fitToPoints(toLngLat(routes[0]));
  }, []);

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
            points={x.taskPoints.map((x) => [x.location.lon, x.location.lat])}
            path={x.taskPoints.map((x) => [x.location.lon, x.location.lat])}
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

      <View className="absolute bottom-12 left-0 right-0 z-50">
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

        {game && game.admin.id === user?.id && false ? (
          <Button
            onPress={choose}
            className="mt-4 flex-1 w-[90%] mx-auto "
            text="Выбрать"
            disabled={routes.length === 0}
          />
        ) : (
          <Button
            className="mt-4 flex-1 w-[90%] mx-auto bg-accent_secondary"
            text="Выбран"
            disabled
          />
        )}
      </View>
    </View>
  );
};
