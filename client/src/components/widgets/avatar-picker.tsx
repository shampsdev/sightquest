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

import { AVATARS } from "@/constants";
import { AvatarStyle } from "@/shared/interfaces/styles";

type Item = AvatarStyle;

const ITEM_WIDTH = 192;
const SPACER_WIDTH = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

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
    const realIndex = index - 1;
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
      <Image
        source={AVATARS.findIndex((x) => String(x.id) === item.id)}
        style={styles.avatarImage}
      />
    </Animated.View>
  );
};

interface AvatarPickerProps {
  avatars: AvatarStyle[];
  onSelect?: (id: string) => void;
}

export const AvatarPicker = ({ avatars, onSelect }: AvatarPickerProps) => {
  const flatListRef = useRef<FlatList<Item>>(null);
  const scrollX = useSharedValue(0);

  const data: Item[] = [
    {
      style: {
        url: "",
      },
      id: "-1",
      priceRoubles: 0,
      title: "",
      type: undefined,
    },
    ...avatars,
    {
      style: {
        url: "",
      },
      id: "-1",
      priceRoubles: 0,
      title: "",
      type: undefined,
    },
  ];

  const lastSelectedIndex = useRef<number | null>(null);

  const triggerHapticAndSelect = (index: number) => {
    const avatar = avatars[index - 1];
    if (avatar) {
      Haptics.selectionAsync();
      onSelect?.(avatar.id);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;

      const centerOffset = event.contentOffset.x + SCREEN_WIDTH / 2;
      const rawIndex =
        (centerOffset - SPACER_WIDTH - ITEM_WIDTH / 2) / ITEM_WIDTH;
      const roundedIndex = Math.round(rawIndex);

      if (
        roundedIndex >= 0 &&
        roundedIndex < AVATARS.length &&
        lastSelectedIndex.current !== roundedIndex
      ) {
        lastSelectedIndex.current = roundedIndex;
        runOnJS(triggerHapticAndSelect)(roundedIndex);
      }
    },
  });

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    if (item.id === "-1") {
      return <View style={{ width: SPACER_WIDTH }} />;
    }

    const onItemPress = () => {
      flatListRef.current?.scrollToIndex({
        index,
        viewPosition: 0.5,
        animated: true,
      });
      onSelect?.(item.id);
    };

    return (
      <Pressable onPress={onItemPress}>
        <AvatarItem item={item} index={index} scrollX={scrollX} />
      </Pressable>
    );
  };

  const snapToOffsets = AVATARS.map((_, i) => {
    return SPACER_WIDTH + i * ITEM_WIDTH - (SCREEN_WIDTH / 2 - ITEM_WIDTH / 2);
  });

  const onLayout = () => {
    requestAnimationFrame(() => {
      const middleIndex = Math.floor(AVATARS.length / 2);
      flatListRef.current?.scrollToIndex({
        index: middleIndex,
        viewPosition: 0.5,
        animated: true,
      });

      onSelect?.(avatars[middleIndex].id);
    });
  };

  const keyExtractor = (item: Item, index: number) =>
    item.id === "-1" ? `spacer-${index}` : `avatar-${item.id}`;

  const getItemLayout = (
    _: ArrayLike<Item> | null | undefined,
    index: number
  ) => {
    if (index === 0 || index === data.length - 1) {
      return {
        length: SPACER_WIDTH,
        offset: index === 0 ? 0 : SPACER_WIDTH + AVATARS.length * ITEM_WIDTH,
        index,
      };
    }
    return {
      length: ITEM_WIDTH,
      offset: SPACER_WIDTH + (index - 1) * ITEM_WIDTH,
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
      contentInset={{ left: SPACER_WIDTH, right: SPACER_WIDTH }}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: 0,
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
