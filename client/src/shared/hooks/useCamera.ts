import { useState, useRef, useEffect } from "react";
import { CameraType, useCameraPermissions, CameraView } from "expo-camera";
import { useTaskCompletionStore } from "../stores/camera.store";
export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");

  const { setPhoto: setStorePhoto } = useTaskCompletionStore();

  const ref = useRef<CameraView>(null);

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePhoto = async () => {
    if (ref.current) {
      const result = await ref.current.takePictureAsync();
      if (result) {
        setStorePhoto(result);
        return result;
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
