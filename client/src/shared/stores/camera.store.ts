import { create } from "zustand";
import type { CameraCapturedPicture } from "expo-camera";

interface CameraState {
  photo: CameraCapturedPicture | null;
  setPhoto: (p: CameraCapturedPicture) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  photo: null,
  setPhoto: (p) => set({ photo: p }),
}));
