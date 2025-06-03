import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

interface TextInputProps extends RNTextInputProps {
  className?: string;
}

export const TextInput = ({
  className,
  secureTextEntry,
  ...props
}: TextInputProps) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <View
      className={twMerge(
        "flex-row items-center rounded-3xl border bg-bg_primary",
        className
      )}
      style={[styles.base, inputFocused ? styles.focused : styles.blurred]}
    >
      <RNTextInput
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={isSecure}
        className="flex-1 font-onest-medium px-5 py-5 text-xl text-text_primary placeholder-text_secondary"
        placeholderTextColor="#878787"
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        {...props}
      />

      {secureTextEntry && (
        <Pressable
          onPress={() => setIsSecure((prev) => !prev)}
          className="px-5"
        >
          <Text className="text-text_secondary text-xl">
            {isSecure ? "E" : "e"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

// тут, к сожалению, twMerge / nativewind не осилил

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
  focused: {
    borderColor: "#8d57f2",
    shadowColor: "#8d57f2",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  blurred: {
    borderColor: "#292B2D",
  },
});
