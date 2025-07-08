import { useStyles } from "@/shared/api/hooks/useStyles";
import { Player } from "@/shared/interfaces/game/player";
import { useAuthStore } from "@/shared/stores/auth.store";
import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { UserPreview } from "./user/user-preview";
import { BlurView } from "expo-blur";

export interface LeaderboardSheetProps extends BottomSheetProps {
  players: Player[];
}

const BackgroundComponent = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View
      className="overflow-hidden"
      style={[style, { borderTopRightRadius: 30, borderTopLeftRadius: 30 }]}
    >
      <BlurView
        className="w-full h-full"
        experimentalBlurMethod="dimezisBlurView"
        tint="dark"
        intensity={100}
      />
    </View>
  );
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
        backgroundComponent={BackgroundComponent}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: "#878787", width: 38 }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView className="rounded-t-3xl px-6 pt-4 pb-10">
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
