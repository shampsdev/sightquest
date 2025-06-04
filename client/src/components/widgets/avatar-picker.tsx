import { useEffect, useRef } from "react";
import {
  FlatList,
  Dimensions,
  StyleSheet,
  Pressable,
  View,
} from "react-native";
import { Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { AVATARS } from "@/constants";

type AvatarItemData = { id: number; src: any };
type Item = AvatarItemData;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = 100;

const SPACER_WIDTH = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

const AvatarItem = ({
  item,
  index,
  scrollX,
}: {
  item: AvatarItemData;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const realIndex = index - 1; // adjust for left spacer
    const itemCenterX = realIndex * ITEM_WIDTH + ITEM_WIDTH / 2 + SPACER_WIDTH;
    const screenCenterX = scrollX.value + SCREEN_WIDTH / 2;
    const distance = Math.abs(itemCenterX - screenCenterX);

    const scale = interpolate(
      distance,
      [0, ITEM_WIDTH],
      [1.2, 0.85],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.avatarContainer, animatedStyle]}>
      <Image source={item.src} style={styles.avatarImage} />
    </Animated.View>
  );
};

export const AvatarPicker = ({
  onSelect,
}: {
  onSelect?: (id: number) => void;
}) => {
  const flatListRef = useRef<FlatList<Item>>(null);
  const scrollX = useSharedValue(0);

  const SPACER_ITEM: Item = { id: -1, src: null };
  const data: Item[] = [SPACER_ITEM, ...AVATARS, SPACER_ITEM];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    if (item.src === null) {
      return <View style={{ width: SPACER_WIDTH }} />;
    }

    return (
      <Pressable
        onPress={() => {
          flatListRef.current?.scrollToIndex({
            index,
            viewPosition: 0.5,
            animated: true,
          });
          onSelect?.(item.id);
        }}
      >
        <AvatarItem item={item} index={index} scrollX={scrollX} />
      </Pressable>
    );
  };

  const snapToOffsets = AVATARS.map((_, i) => {
    return SPACER_WIDTH + i * ITEM_WIDTH - (SCREEN_WIDTH / 2 - ITEM_WIDTH / 2);
  });

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={data}
      horizontal
      onLayout={() => {
        requestAnimationFrame(() => {
          const middleIndex = Math.floor(AVATARS.length / 2);
          flatListRef.current?.scrollToIndex({
            index: middleIndex,
            viewPosition: 0.5,
            animated: true,
          });

          onSelect?.(AVATARS[middleIndex].id);
        });
      }}
      snapToOffsets={snapToOffsets}
      contentInset={{ left: SPACER_WIDTH, right: SPACER_WIDTH }}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: 0,
      }}
      style={{ width: SCREEN_WIDTH }}
      keyExtractor={(item, index) =>
        item.src === null ? `spacer-${index}` : `avatar-${item.id}`
      }
      renderItem={renderItem}
      getItemLayout={(_, index) => {
        if (index === 0 || index === data.length - 1) {
          return {
            length: SPACER_WIDTH,
            offset:
              index === 0 ? 0 : SPACER_WIDTH + AVATARS.length * ITEM_WIDTH,
            index,
          };
        }
        return {
          length: ITEM_WIDTH,
          offset: SPACER_WIDTH + (index - 1) * ITEM_WIDTH,
          index,
        };
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
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
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
