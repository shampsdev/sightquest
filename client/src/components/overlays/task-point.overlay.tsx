import { useEffect } from "react";
import { Text, View, Image, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TaskPoint } from "@/shared/interfaces/route";
import { Button } from "../ui/button";
import { useOverlays } from "@/shared/hooks/useOverlays";
import { Icons } from "../ui/icons/icons";
import { CompletedTaskPoint } from "@/shared/interfaces/game/completed-task-point";
import { IconContainer } from "../ui/icons/icon-container";
import { usePlayer } from "@/shared/hooks/usePlayer";

export interface TaskPointOverlayProps {
  visible?: boolean;
  taskPoint?: TaskPoint;
  completedTaskPoint?: CompletedTaskPoint;
}

export const TaskPointOverlay = ({
  visible,
  taskPoint,
  completedTaskPoint,
}: TaskPointOverlayProps) => {
  const { openOverlay, closeOverlay, isOverlayOpen } = useOverlays();
  const opacity = useSharedValue(0);

  const { player } = usePlayer();

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onButtonPress = () => {
    if (player?.role == "catcher") return;
    closeOverlay("taskPoint");
    if (taskPoint)
      openOverlay("camera", {
        action: {
          type: "completeTask",
          taskId: taskPoint.id,
        },
      });
  };

  return (
    taskPoint && (
      <Animated.View
        style={animatedStyle}
        className="absolute w-full h-full flex justify-end items-center"
        pointerEvents={visible ? "auto" : "none"}
      >
        <View className="absolute top-20 w-full z-40">
          <View className="w-[90%] mx-auto flex-row justify-between items-center">
            <Pressable onPress={() => closeOverlay()}>
              <IconContainer>
                {isOverlayOpen() ? <Icons.Back /> : <Icons.Exit />}
              </IconContainer>
            </Pressable>
          </View>
        </View>

        {/* Background Image */}
        <Image
          source={require("@/assets/place/image.png")}
          className="absolute top-0 left-0 w-full"
          resizeMode="cover"
        />

        {/* Content Sleeve */}
        <View className="flex justify-between px-8 pt-10 bg-[#FFF] w-full h-[65%] rounded-t-[40px] z-10">
          <View className="gap-5">
            <Text className="text-3xl font-bounded-medium">
              {taskPoint.title}
            </Text>
            <Text className="text-xl">{taskPoint.description}</Text>
            <View className="bg-[#9090901A] w-full p-3 gap-4 rounded-2xl flex flex-row">
              <View className="bg-[#FFF] h-[72px] w-[72px] rounded-xl overflow-hidden flex justify-center items-center">
                {completedTaskPoint ? (
                  <>
                    <Image
                      className="h-full w-full"
                      source={{ uri: completedTaskPoint.photo }}
                    />
                  </>
                ) : (
                  <>
                    <Icons.Camera width={30} height={30} stroke="#975DFF" />
                  </>
                )}
              </View>
              <View className="flex-1">
                {/* Takes remaining space */}
                <Text
                  className="text-lg font-bounded-medium"
                  numberOfLines={1} // Optional: limit title lines
                >
                  {taskPoint.title}
                </Text>
                <Text
                  className="text-md"
                  numberOfLines={3} // Optional: limit description lines
                >
                  {taskPoint.task}
                </Text>
              </View>
            </View>
          </View>
          <Button
            className="bottom-12 mx-auto"
            variant={
              completedTaskPoint || player?.role == "catcher"
                ? "disabled"
                : "default"
            }
            onPress={onButtonPress}
            text={
              completedTaskPoint
                ? "Задание выполнено"
                : player?.role == "catcher"
                ? "Упс, ты догонающий!"
                : "Выполнить задание"
            }
          />
        </View>
      </Animated.View>
    )
  );
};
