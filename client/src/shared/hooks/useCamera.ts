import { useState, useRef, useEffect } from "react";
import { CameraType, useCameraPermissions, CameraView } from "expo-camera";
import { CameraCapturedPicture } from "expo-camera/src/Camera.types";

export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);

  const ref = useRef<CameraView>(null);

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePhoto = async () => {
    if (ref.current) {
      const result = await ref.current.takePictureAsync();
      setPhoto(result);
      return result;
    }
  };

  return {
    cameraRef: ref,
    permission,
    requestPermission,
    facing,
    toggleFacing,
    takePhoto,
    photo,
  };
};
