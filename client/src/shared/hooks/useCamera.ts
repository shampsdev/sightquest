import { useState, useRef } from "react";
import { CameraType, useCameraPermissions, CameraView } from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");

  const ref = useRef<CameraView>(null);

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePhoto = async () => {
    if (ref.current) {
      const rawPhoto = await ref.current.takePictureAsync({
        quality: 0,
      });

      const processedPhoto = await ImageManipulator.manipulate(rawPhoto.uri)
        .resize({
          width: 800,
          height: 800,
        })
        .renderAsync();

      const photo = await processedPhoto.saveAsync({ format: SaveFormat.JPEG });

      if (photo) {
        return photo;
      }
    }
  };

  return {
    cameraRef: ref,
    permission,
    requestPermission,
    facing,
    toggleFacing,
    takePhoto,
  };
};
