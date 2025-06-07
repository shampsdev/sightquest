import React, { Ref, useImperativeHandle, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface SectionProps {
  selected?: boolean;
  text: string;
  onPress: () => void;
  onTextLayout: (event: LayoutChangeEvent) => void;
}

const Section = ({ selected, text, onPress, onTextLayout }: SectionProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="pt-[8px] w-[100px] flex text-center items-center justify-center"
    >
      <Text
        onLayout={onTextLayout}
        className={`pb-[10px] text-[16px] font-onest-regular text-center ${
          selected
            ? "text-accent_primary  border-b-[3px] border-bg_primary "
            : "text-text_secondary border-b-[3px] border-bg_primary"
        }`}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

interface SectionPickerProps {
  options: string[];
  selectedRef: Ref<{ selectedSection: string }>;
  onChange?: (section: string) => void;
}

export const SectionPicker = ({
  options,
  selectedRef,
  onChange,
}: SectionPickerProps) => {
  const [selectedSection, setSelectedSection] = useState<string>(options[0]);
  const [textWidths, setTextWidths] = useState<number[]>(
    new Array(options.length).fill(0)
  );
  const translateX = useSharedValue(0);
  const underlineWidth = useSharedValue(0);

  useImperativeHandle(selectedRef, () => ({
    selectedSection,
  }));

  const handleTextLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTextWidths((prev) => {
      const newWidths = [...prev];
      newWidths[index] = width;
      return newWidths;
    });
  };

  useEffect(() => {
    const index = options.indexOf(selectedSection);
    let offsetX = 0;

    for (let i = 0; i < index; i++) {
      offsetX += 100 + 24;
    }

    offsetX += (100 - textWidths[index]) / 2;

    if (index === options.length - 1) {
      offsetX =
        offsetX - (100 - textWidths[index]) / 2 + (100 - textWidths[index]) / 2;
    }

    translateX.value = withTiming(offsetX, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    underlineWidth.value = withTiming(textWidths[index] || 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    if (onChange) {
      onChange(selectedSection);
    }
  }, [selectedSection, textWidths]);

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: underlineWidth.value,
    };
  });

  return (
    <View className="relative flex flex-row justify-between items-center gap-[24px] ">
      {options.map((option, index) => (
        <Section
          key={index}
          text={option}
          selected={selectedSection === option}
          onPress={() => handleSectionChange(option)}
          onTextLayout={handleTextLayout(index)}
        />
      ))}
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            bottom: 5,
            height: 3,
            backgroundColor: "#975DFF",
          },
        ]}
      />
    </View>
  );
};
