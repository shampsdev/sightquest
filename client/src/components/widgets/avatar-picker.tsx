import { useRef } from "react";
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
  runOnJS,
  SharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

import { AvatarStyle } from "@/shared/interfaces/styles";

type Item = AvatarStyle;

const ITEM_WIDTH = 192;
const PADDING_HORIZONTAL = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

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
    const itemCenterX =
      index * ITEM_WIDTH + ITEM_WIDTH / 2 + PADDING_HORIZONTAL;
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

  if (!item.style.url || item.style.url === "") {
    console.warn(`Invalid image URL for item ${item.id}: ${item.style.url}`);
    return null;
  }

  return (
    <Animated.View style={[styles.avatarContainer, animatedStyle]}>
      <Image
        source={{ uri: item.style.url }}
        style={styles.avatarImage}
        onError={(e) =>
          console.error(
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
}: {
  onSelect?: (id: string) => void;
  avatars: Item[];
}) => {
  const flatListRef = useRef<FlatList<Item>>(null);
  const scrollX = useSharedValue(0);

  console.log("AvatarPicker avatars:", avatars);

  const data: Item[] = avatars;

  const lastSelectedIndex = useRef<number | null>(null);

  const triggerHapticAndSelect = (index: number) => {
    const avatar = avatars[index];
    if (avatar && avatar.type === "avatar") {
      Haptics.selectionAsync();
      onSelect?.(avatar.id);
      console.log("Selected avatar:", avatar.id);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;

      const centerOffset = event.contentOffset.x + SCREEN_WIDTH / 2;
      const rawIndex = (centerOffset - PADDING_HORIZONTAL) / ITEM_WIDTH;
      const roundedIndex = Math.round(rawIndex);

      if (
        roundedIndex >= 0 &&
        roundedIndex < avatars.length &&
        lastSelectedIndex.current !== roundedIndex
      ) {
        lastSelectedIndex.current = roundedIndex;
        runOnJS(triggerHapticAndSelect)(roundedIndex);
      }
    },
  });

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    const onItemPress = () => {
      flatListRef.current?.scrollToOffset({
        offset:
          index * ITEM_WIDTH +
          PADDING_HORIZONTAL -
          (SCREEN_WIDTH - ITEM_WIDTH) / 2,
        animated: true,
      });
      lastSelectedIndex.current = index;
      runOnJS(triggerHapticAndSelect)(index);
    };

    return (
      <Pressable onPress={onItemPress}>
        <AvatarItem item={item} index={index} scrollX={scrollX} />
      </Pressable>
    );
  };

  const snapToOffsets = avatars.map((_, i) => {
    return (
      i * ITEM_WIDTH + PADDING_HORIZONTAL - (SCREEN_WIDTH - ITEM_WIDTH) / 2
    );
  });

  const onLayout = () => {
    requestAnimationFrame(() => {
      if (avatars.length === 0) {
        console.log("No avatars to scroll to");
        return;
      }
      const middleIndex = Math.floor(avatars.length / 2);
      flatListRef.current?.scrollToOffset({
        offset:
          middleIndex * ITEM_WIDTH +
          PADDING_HORIZONTAL -
          (SCREEN_WIDTH - ITEM_WIDTH) / 2,
        animated: true,
      });
      const avatar = avatars[middleIndex];
      if (avatar) {
        onSelect?.(avatar.id);
      }
    });
  };

  const keyExtractor = (item: Item) => `avatar-${item.id}`;

  const getItemLayout = (
    _: ArrayLike<Item> | null | undefined,
    index: number
  ) => {
    return {
      length: ITEM_WIDTH,
      offset: PADDING_HORIZONTAL + index * ITEM_WIDTH,
      index,
    };
  };

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={data}
      horizontal
      onLayout={onLayout}
      snapToOffsets={snapToOffsets}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: PADDING_HORIZONTAL,
        alignItems: "center",
      }}
      style={{ width: SCREEN_WIDTH }}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
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
    width: 160,
    height: 160,
    borderRadius: 40,
  },
});
