import { MarkerView } from "@rnmapbox/maps";
import { View } from "react-native";
import { Icons } from "@/components/ui/icons/icons"; // Убедись, что путь корректный

interface PlaceMarkerProps {
  coordinate: [number, number];
  isSelected?: boolean;
  allowOverlap?: boolean;
  allowOverlapWithPuck?: boolean;
  disabled?: boolean;
}

export const PlaceMarker = ({
  coordinate,
  isSelected = false,
  allowOverlap = false,
  allowOverlapWithPuck = false,
  disabled = false,
}: PlaceMarkerProps) => {
  return (
    <MarkerView
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 1 }}
      allowOverlap={allowOverlap}
      allowOverlapWithPuck={allowOverlapWithPuck}
      isSelected={isSelected}
    >
      <View className="w-8 h-10 items-center justify-center">
        <Icons.Marker fill={disabled ? "#975DFF80" : "#975DFF"} />
      </View>
    </MarkerView>
  );
};
