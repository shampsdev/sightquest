import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, Text as RNText, TextInput as RNTextInput } from "react-native";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { TextInput } from "../ui/textinput";

// Utility to format input as XXX XXX
const formatCode = (value: string) => {
  const numeric = value.replace(/\D/g, "").slice(0, 6); // only digits, max 6
  if (numeric.length <= 3) return numeric;
  return `${numeric.slice(0, 3)} ${numeric.slice(3)}`;
};

export const JoinBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const localRef = useRef<BottomSheet>(null);
  const [code, setCode] = useState("");

  useImperativeHandle(ref, () => localRef.current!);

  const handleChangeText = useCallback((text: string) => {
    const numericOnly = text.replace(/\D/g, "").slice(0, 6);
    setCode(numericOnly);
  }, []);

  return (
    <BottomSheet
      ref={localRef}
      index={-1}
      snapPoints={["40%"]}
      enableDynamicSizing={false}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "#222323" }}
      handleIndicatorStyle={{ backgroundColor: "#878787", width: 38 }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView className="bg-zinc-900 rounded-t-3xl px-6 pt-4 pb-10">
        <View className="gap-5">
          <RNText className="text-center text-3xl text-text_primary font-bounded-semibold">
            Код доступа
          </RNText>
          <RNText className="text-center w-[70%] mx-auto text-lg text-text_secondary font-onest-medium">
            Введите код от друга, чтобы присоединиться к игре
          </RNText>
          <TextInput
            keyboardType="numeric"
            inputClassName="text-center py-4 text-2xl font-bounded-black"
            InputComponent={BottomSheetTextInput}
            value={formatCode(code)}
            onChangeText={handleChangeText}
            maxLength={7}
          />
          <Button
            className={twMerge(
              "flex-1 w-auto mt-5",
              code.length !== 6 ? "bg-accent_secondary" : ""
            )}
            text="Готово"
            disabled={code.length !== 6}
            onPress={() => {
              console.log("Submitted code:", code);
              handleChangeText("");
            }}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});
