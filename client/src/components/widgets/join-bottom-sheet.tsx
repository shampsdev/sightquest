import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { TextInput } from "../ui/textinput";

export interface JoinBottomSheetProps extends BottomSheetProps {
  handleJoin: (id: string) => void;
}

const formatCode = (value: string) => {
  return value;
};

export const JoinBottomSheet = forwardRef<BottomSheet, JoinBottomSheetProps>(
  ({ handleJoin }, ref) => {
    const localRef = useRef<BottomSheet>(null);
    const [code, setCode] = useState("");

    useImperativeHandle(ref, () => localRef.current!);
    const [focus, setFocus] = useState<boolean>(false);

    const handleChangeText = useCallback((text: string) => {
      setCode(text);
    }, []);

    return (
      <BottomSheet
        ref={localRef}
        index={-1}
        snapPoints={focus ? ["80%"] : ["40%"]}
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
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              maxLength={7}
            />
            <Button
              className={twMerge(
                "flex-1 w-auto mt-5",
                code.length !== 6 ? "bg-accent_secondary" : ""
              )}
              text="Готово"
              disabled={code.length === 0}
              onPress={() => {
                handleChangeText("");
                handleJoin(code);
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);
