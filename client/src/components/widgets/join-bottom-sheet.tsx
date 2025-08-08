import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text as RNText, TextInput as RNTextInput } from "react-native";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { TextInput } from "../ui/textinput";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ["55%", "80%"], []);

    useImperativeHandle(ref, () => localRef.current!);

    const handleChangeText = useCallback((text: string) => {
      setCode(text);
    }, []);

    return (
      <BottomSheet
        ref={localRef}
        index={-1}
        // Two static snap points; expand to the larger one on focus to clear the keyboard
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#222323" }}
        handleIndicatorStyle={{ backgroundColor: "#878787", width: 38 }}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        bottomInset={insets.bottom}
      >
        <BottomSheetView
          className="bg-zinc-900 rounded-t-3xl px-6 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 10) }}
        >
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
              onFocus={() => localRef.current?.expand()}
              onBlur={() => localRef.current?.snapToIndex(0)}
              maxLength={7}
            />
            <Button
              className={twMerge(
                "flex-1 w-auto mt-5",
                code.length !== 6 ? "bg-accent_secondary" : ""
              )}
              text="Готово"
              variant={code.length === 0 ? "disabled" : "default"}
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
