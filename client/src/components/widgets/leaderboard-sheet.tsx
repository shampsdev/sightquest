import { useStyles } from "@/shared/api/hooks/useStyles";
import { Player } from "@/shared/interfaces/game/player";
import { useAuthStore } from "@/shared/stores/auth.store";
import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Pressable, View } from "react-native";
import { UserPreview } from "./user/user-preview";
import { BlurView } from "expo-blur";

export interface LeaderboardSheetProps extends BottomSheetProps {
  players: Player[];
  onPlayerPress?: (player: Player) => void;
}

const BackgroundComponent = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <View
      className="overflow-hidden"
      style={[style, { borderTopRightRadius: 30, borderTopLeftRadius: 30 }]}
    >
      <BlurView
        className="w-full h-full"
        
        tint="dark"
        intensity={100}
      />
    </View>
  );
};

export const LeaderboardSheet = forwardRef<BottomSheet, LeaderboardSheetProps>(
  (props, ref) => {
    const { players, onPlayerPress } = props;
    const localRef = useRef<BottomSheet>(null);

    const { user } = useAuthStore();

    useImperativeHandle(ref, () => localRef.current!);

    const { data: avatars } = useStyles({ type: "avatar" });

    const sortedPlayers = useMemo(
      () => (players ? [...players].sort((a, b) => b.score - a.score) : []),
      [players]
    );

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
            {sortedPlayers.map((player) => (
              <Pressable
                key={player.user.id}
                onPress={() => {
                  if (onPlayerPress) onPlayerPress(player);
                }}
              >
                <UserPreview
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
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);
