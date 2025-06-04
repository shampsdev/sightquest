import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Pressable,
  StyleSheet,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { Icons } from "./icons/icons";

interface TextInputProps extends RNTextInputProps {
  className?: string;
  inputClassName?: string;
  InputComponent?: React.ComponentType<RNTextInputProps>;
}

export const TextInput = ({
  className,
  inputClassName,
  secureTextEntry,
  InputComponent = RNTextInput,
  ...props
}: TextInputProps) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <View
      className={twMerge("flex-row items-center rounded-3xl border", className)}
      style={[styles.base, inputFocused ? styles.focused : styles.blurred]}
    >
      <InputComponent
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={isSecure}
        className={twMerge(
          "flex-1 font-onest-medium px-5 py-5 text-xl text-text_primary placeholder-text_secondary",
          inputClassName
        )}
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
          {isSecure ? <Icons.Eye fill="#878787" /> : <Icons.Eye />}
        </Pressable>
      )}
    </View>
  );
};

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
