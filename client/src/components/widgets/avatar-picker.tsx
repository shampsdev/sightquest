import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

import { AvatarStyle } from "@/shared/interfaces/styles/styles";
import { logger } from "@/shared/instances/logger.instance";

type Item = AvatarStyle;

const ITEM_WIDTH = 192;
const CONTENT_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

const AvatarItem = ({
  item,
  index,
  scrollX,
}: {
  item: Item;
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.85, 1.2, 0.85],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  if (!item.style.url || item.style.url === "") {
    logger.warn(
      "ui",
      `Invalid image URL for item ${item.id}: ${item.style.url}`
    );
    return null;
  }

  return (
    <Animated.View style={[styles.avatarContainer, animatedStyle]}>
      <Image
        source={{ uri: item.style.url }}
        style={styles.avatarImage}
        onError={(e) =>
          logger.error(
            "ui",
            `Image failed to load: ${item.style.url}`,
            e.nativeEvent.error
          )
        }
      />
    </Animated.View>
  );
};

export const AvatarPicker = ({
  onSelect,
  avatars,
  className,
}: {
  onSelect?: (id: string) => void;
  avatars: Item[];
  className?: string;
}) => {
  const flatListRef = useRef<FlatList<Item>>(null);
  const scrollX = useSharedValue(0);
  const isSelecting = useSharedValue(0);

  const data: Item[] = avatars;

  const lastCenteredIndex = useSharedValue<number>(-1);

  const triggerHapticAndSelect = (index: number) => {
    if (isSelecting.value === 1) return;
    isSelecting.value = 1;

    if (index < 0 || index >= avatars.length) {
      logger.warn("ui", `Invalid centered index: ${index}`);
      isSelecting.value = 0;
      return;
    }

    const avatar = avatars[index];
    if (avatar && avatar.type === "avatar") {
      Haptics.selectionAsync();
      onSelect?.(avatar.id);
      logger.log(
        "ui",
        `Selected centered avatar: id=${avatar.id}, index=${index}`
      );
    }

    setTimeout(() => {
      isSelecting.value = 0;
    }, 300);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const offset = event.contentOffset.x;
      const rawIndex = offset / ITEM_WIDTH;
      const roundedIndex = Math.round(rawIndex);

      if (
        roundedIndex >= 0 &&
        roundedIndex < avatars.length &&
        lastCenteredIndex.value !== roundedIndex
      ) {
        lastCenteredIndex.value = roundedIndex;
        runOnJS(triggerHapticAndSelect)(roundedIndex);
      }
    },
  });

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    const onItemPress = () => {
      const offset = index * ITEM_WIDTH;
      flatListRef.current?.scrollToOffset({
        offset,
        animated: true,
      });
      logger.log(
        "ui",
        `Tapped avatar: id=${item.id}, index=${index}, targetOffset=${offset}`
      );
    };

    return (
      <Pressable onPress={onItemPress}>
        <AvatarItem item={item} index={index} scrollX={scrollX} />
      </Pressable>
    );
  };

  const snapToOffsets = avatars.map((_, i) => i * ITEM_WIDTH);

  useEffect(() => {
    if (avatars.length === 0) {
      logger.log("ui", "No avatars to scroll to");
      return;
    }
    const middleIndex = Math.floor(avatars.length / 2);
    const initialOffset = middleIndex * ITEM_WIDTH;
    flatListRef.current?.scrollToOffset({
      offset: initialOffset,
      animated: false,
    });
    scrollX.value = initialOffset;
    lastCenteredIndex.value = middleIndex;
    triggerHapticAndSelect(middleIndex);
    logger.log(
      "ui",
      `Initial centered: index=${middleIndex}, offset=${initialOffset}`
    );
  }, [avatars]);

  const keyExtractor = (item: Item) => `avatar-${item.id}`;

  const getItemLayout = (
    _: ArrayLike<Item> | null | undefined,
    index: number
  ) => ({
    length: ITEM_WIDTH,
    offset: index * ITEM_WIDTH,
    index,
  });

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={data}
      horizontal
      snapToOffsets={snapToOffsets}
      snapToAlignment="start"
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: CONTENT_PADDING,
      }}
      style={{ width: SCREEN_WIDTH }}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      className={className}
    />
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 160,
    height: 160,
    borderRadius: 40,
  },
});
