import { useStyles } from "@/shared/api/hooks/useStyles";
import { Player } from "@/shared/interfaces/player";
import { useAuthStore } from "@/shared/stores/auth.store";
import BottomSheet, {
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { UserPreview } from "./user/user-preview";

export interface LeaderboardSheetProps extends BottomSheetProps {
  players: Player[];
}

const formatCode = (value: string) => {
  return value;
};

export const LeaderboardSheet = forwardRef<BottomSheet, LeaderboardSheetProps>(
  ({ players }, ref) => {
    const localRef = useRef<BottomSheet>(null);

    const { user } = useAuthStore();

    useImperativeHandle(ref, () => localRef.current!);

    const { data: avatars } = useStyles({ type: "avatar" });

    return (
      <BottomSheet
        ref={localRef}
        index={-1}
        snapPoints={["85%"]}
        enableDynamicSizing={false}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#222323", opacity: 0.9 }}
        handleIndicatorStyle={{ backgroundColor: "#878787", width: 38 }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView className="bg-zinc-900 rounded-t-3xl px-6 pt-4 pb-10">
          <View className="flex flex-col w-full gap-[15px]">
            {players &&
              players
                .sort((a, b) => a.score - b.score)
                .map((player) => (
                  <UserPreview
                    key={player.user.id}
                    avatar={{
                      uri: avatars?.find(
                        (x) => player?.user.styles?.avatarId === x.id
                      )?.style.url,
                    }}
                    name={player.user.name}
                    active={player.user.id === user?.id}
                    scores={player.score}
                    role={player.role}
                  />
                ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);
